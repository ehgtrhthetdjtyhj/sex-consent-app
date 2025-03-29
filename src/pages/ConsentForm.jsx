import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SignaturePad from '../components/SignaturePad';
import { generateConsentPDF, downloadPDF } from '../utils/pdfGenerator';
import { generateSecureKey, generateUniqueId } from '../utils/encryption';
import { saveConsent } from '../services/storageService';

const ConsentForm = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // 表单数据
  const [formData, setFormData] = useState({
    party1: {
      name: '',
      idNumber: '',
      contact: ''
    },
    party2: {
      name: '',
      idNumber: '',
      contact: ''
    },
    validPeriod: '24小时',
    customTerms: '',
    acknowledgements: {
      isAdult: false,
      isConsensual: false,
      isInformed: false,
      isRespectful: false,
      isConfidential: false
    }
  });
  
  // 签名数据
  const [signatures, setSignatures] = useState({
    party1: null,
    party2: null
  });
  
  // 加密密钥和ID
  const [secretKey, setSecretKey] = useState('');
  const [documentId, setDocumentId] = useState('');
  
  // 处理表单变更
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name.startsWith('party1.') || name.startsWith('party2.')) {
      const [party, field] = name.split('.');
      setFormData({
        ...formData,
        [party]: {
          ...formData[party],
          [field]: value
        }
      });
    } else if (name.startsWith('acknowledgements.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        acknowledgements: {
          ...formData.acknowledgements,
          [field]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // 处理签名
  const handleSignature = (party, dataUrl) => {
    setSignatures({
      ...signatures,
      [party]: dataUrl
    });
    setSuccessMessage(`${party === 'party1' ? '参与方1' : '参与方2'}签名已保存`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };
  
  // 验证表单
  const validateForm = () => {
    // 重置错误信息
    setErrorMessage('');
    
    // 检查个人信息
    if (!formData.party1.name || !formData.party1.idNumber) {
      setErrorMessage('请填写参与方1的必要信息');
      return false;
    }
    
    if (!formData.party2.name || !formData.party2.idNumber) {
      setErrorMessage('请填写参与方2的必要信息');
      return false;
    }
    
    // 检查确认事项
    const acknowledgements = Object.values(formData.acknowledgements);
    if (acknowledgements.includes(false)) {
      setErrorMessage('请确认所有必要条款');
      return false;
    }
    
    return true;
  };
  
  // 验证签名
  const validateSignatures = () => {
    if (!signatures.party1) {
      setErrorMessage('请添加参与方1的签名');
      return false;
    }
    
    if (!signatures.party2) {
      setErrorMessage('请添加参与方2的签名');
      return false;
    }
    
    return true;
  };
  
  // 下一步
  const handleNext = () => {
    if (step === 1 && validateForm()) {
      setStep(2);
    } else if (step === 2 && validateSignatures()) {
      // 生成协议最终版本，包括签名
      generateFinalDocument();
    }
  };
  
  // 上一步
  const handleBack = () => {
    setStep(step - 1);
  };
  
  // 生成最终文档
  const generateFinalDocument = async () => {
    try {
      setLoading(true);
      
      // 生成唯一ID和安全密钥
      const id = generateUniqueId();
      const key = generateSecureKey();
      
      setDocumentId(id);
      setSecretKey(key);
      
      // 准备完整协议数据
      const currentDate = new Date().toISOString().split('T')[0];
      const consentData = {
        ...formData,
        id,
        date: currentDate,
      };
      
      // 生成PDF
      const pdfDoc = generateConsentPDF(
        consentData,
        signatures.party1,
        signatures.party2
      );
      
      if (!pdfDoc) {
        throw new Error('PDF生成失败');
      }
      
      // 保存加密数据
      const saved = saveConsent(consentData, key);
      if (!saved) {
        throw new Error('协议保存失败');
      }
      
      // 自动下载PDF
      downloadPDF(pdfDoc, `consent-agreement-${id}.pdf`);
      
      // 最后一步展示密钥
      setStep(3);
    } catch (error) {
      console.error('生成文档失败:', error);
      setErrorMessage('生成协议失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 重置表单
  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    
    setFormData({
      party1: { name: '', idNumber: '', contact: '' },
      party2: { name: '', idNumber: '', contact: '' },
      validPeriod: '24小时',
      customTerms: '',
      acknowledgements: {
        isAdult: false,
        isConsensual: false,
        isInformed: false,
        isRespectful: false,
        isConfidential: false
      }
    });
    
    setSignatures({ party1: null, party2: null });
    setStep(1);
    setErrorMessage('');
    setSuccessMessage('');
  };
  
  // 返回首页
  const returnHome = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">创建性行为同意协议</h2>
        <div className="flex mt-4">
          <div className={`w-1/3 text-center pb-2 ${step >= 1 ? 'border-b-2 border-white text-white' : 'text-indigo-200'}`}>
            个人信息与条款
          </div>
          <div className={`w-1/3 text-center pb-2 ${step >= 2 ? 'border-b-2 border-white text-white' : 'text-indigo-200'}`}>
            签名确认
          </div>
          <div className={`w-1/3 text-center pb-2 ${step >= 3 ? 'border-b-2 border-white text-white' : 'text-indigo-200'}`}>
            生成与保存
          </div>
        </div>
      </div>
      
      <form ref={formRef} className="px-6 py-8">
        {/* 错误和成功提示 */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
            {successMessage}
          </div>
        )}
        
        {/* 步骤1: 个人信息和条款 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 参与方1信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">参与方1信息</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="party1.name"
                    value={formData.party1.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">身份证号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="party1.idNumber"
                    value={formData.party1.idNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">联系方式</label>
                  <input
                    type="text"
                    name="party1.contact"
                    value={formData.party1.contact}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              {/* 参与方2信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">参与方2信息</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="party2.name"
                    value={formData.party2.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">身份证号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="party2.idNumber"
                    value={formData.party2.idNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">联系方式</label>
                  <input
                    type="text"
                    name="party2.contact"
                    value={formData.party2.contact}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            {/* 协议有效期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">协议有效期</label>
              <select
                name="validPeriod"
                value={formData.validPeriod}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="6小时">6小时</option>
                <option value="12小时">12小时</option>
                <option value="24小时">24小时</option>
                <option value="48小时">48小时</option>
              </select>
            </div>
            
            {/* 自定义条款 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">自定义条款（可选）</label>
              <textarea
                name="customTerms"
                value={formData.customTerms}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="在此添加您希望包含的额外条款..."
              />
            </div>
            
            {/* 确认事项 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">确认事项</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <input
                    id="isAdult"
                    name="acknowledgements.isAdult"
                    type="checkbox"
                    checked={formData.acknowledgements.isAdult}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                  <label htmlFor="isAdult" className="ml-3 block text-sm text-gray-700">
                    我们确认双方均已年满18周岁，并具有完全民事行为能力
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    id="isConsensual"
                    name="acknowledgements.isConsensual"
                    type="checkbox"
                    checked={formData.acknowledgements.isConsensual}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                  <label htmlFor="isConsensual" className="ml-3 block text-sm text-gray-700">
                    我们确认双方均自愿参与本次行为，不存在任何形式的胁迫、欺骗或误导
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    id="isInformed"
                    name="acknowledgements.isInformed"
                    type="checkbox"
                    checked={formData.acknowledgements.isInformed}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                  <label htmlFor="isInformed" className="ml-3 block text-sm text-gray-700">
                    我们了解可能的健康风险，并已采取适当的安全措施
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    id="isRespectful"
                    name="acknowledgements.isRespectful"
                    type="checkbox"
                    checked={formData.acknowledgements.isRespectful}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                  <label htmlFor="isRespectful" className="ml-3 block text-sm text-gray-700">
                    我们尊重对方的身体自主权，同意在任何一方表示不适或拒绝时立即停止
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    id="isConfidential"
                    name="acknowledgements.isConfidential"
                    type="checkbox"
                    checked={formData.acknowledgements.isConfidential}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                  <label htmlFor="isConfidential" className="ml-3 block text-sm text-gray-700">
                    我们同意对本次行为及相关信息保密，不向第三方泄露
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 步骤2: 签名确认 */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    请在下方签名区域进行签名确认。签名完成后，点击"确认签名"按钮保存签名。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 参与方1签名 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">参与方1签名: {formData.party1.name}</h3>
                <SignaturePad 
                  onSave={(dataUrl) => handleSignature('party1', dataUrl)} 
                  label={`${formData.party1.name}，请在此处签名`}
                />
                {signatures.party1 && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">签名已保存</p>
                  </div>
                )}
              </div>
              
              {/* 参与方2签名 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">参与方2签名: {formData.party2.name}</h3>
                <SignaturePad 
                  onSave={(dataUrl) => handleSignature('party2', dataUrl)} 
                  label={`${formData.party2.name}，请在此处签名`}
                />
                {signatures.party2 && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">签名已保存</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 步骤3: 生成与保存 */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 p-6 rounded-lg">
              <svg className="h-12 w-12 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-medium text-green-800 mt-4">同意协议已成功生成</h3>
              <p className="mt-2 text-sm text-gray-600">
                PDF文档已自动下载到您的设备。如果未自动下载，请点击下方按钮重新下载。
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">重要信息 - 请妥善保存</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">协议ID (用于验证协议)：</p>
                <div className="bg-white p-3 rounded border border-gray-300 text-gray-800 font-mono">
                  {documentId}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">解密密钥 (用于查看加密内容)：</p>
                <div className="bg-white p-3 rounded border border-gray-300 text-gray-800 font-mono break-all">
                  {secretKey}
                </div>
                <p className="mt-2 text-xs text-red-500">
                  警告: 请务必安全保存此密钥，丢失后将无法恢复协议内容。系统出于安全考虑不会存储此密钥。
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  // 重新下载PDF
                  const consentData = {
                    ...formData,
                    id: documentId,
                    date: new Date().toISOString().split('T')[0]
                  };
                  
                  const pdfDoc = generateConsentPDF(
                    consentData,
                    signatures.party1,
                    signatures.party2
                  );
                  
                  if (pdfDoc) {
                    downloadPDF(pdfDoc, `consent-agreement-${documentId}.pdf`);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
              >
                重新下载PDF
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-medium py-2 px-4 rounded"
              >
                创建新协议
              </button>
              <button
                type="button"
                onClick={returnHome}
                className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4"
              >
                返回首页
              </button>
            </div>
          </div>
        )}
        
        {/* 表单操作按钮 */}
        {step < 3 && (
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                上一步
              </button>
            ) : (
              <button
                type="button"
                onClick={returnHome}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className={`py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : step === 2 ? '生成协议' : '下一步'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConsentForm; 