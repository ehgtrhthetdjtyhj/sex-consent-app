import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEncryptedConsent, getDecryptedConsent } from '../services/storageService';
import { generateConsentPDF, downloadPDF } from '../utils/pdfGenerator';

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [secretKey, setSecretKey] = useState('');
  const [consentData, setConsentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signatures, setSignatures] = useState({ party1: null, party2: null });
  
  // 检查是否有加密数据
  useEffect(() => {
    const encryptedData = getEncryptedConsent(id);
    if (!encryptedData) {
      setError('找不到指定ID的协议数据');
    }
  }, [id]);
  
  // 处理解密
  const handleDecrypt = () => {
    if (!secretKey.trim()) {
      setError('请输入解密密钥');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = getDecryptedConsent(id, secretKey);
      
      if (!data) {
        setError('解密失败，请检查密钥是否正确');
        setLoading(false);
        return;
      }
      
      // 设置协议数据
      setConsentData(data);
      
      // 分离签名数据（如果有）
      if (data.signatures) {
        setSignatures(data.signatures);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('解密错误:', error);
      setError('解密过程中出现错误');
      setLoading(false);
    }
  };
  
  // 下载PDF
  const handleDownloadPDF = () => {
    if (!consentData) return;
    
    const pdfDoc = generateConsentPDF(
      consentData,
      signatures.party1,
      signatures.party2
    );
    
    if (pdfDoc) {
      downloadPDF(pdfDoc, `consent-agreement-${id}.pdf`);
    }
  };
  
  // 返回首页
  const returnHome = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">查看性行为同意协议</h2>
      </div>
      
      <div className="px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}
        
        {!consentData ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    协议内容已加密。请输入解密密钥以查看完整协议内容。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">协议ID</label>
                <div className="mt-1 bg-gray-100 p-3 rounded border border-gray-300 text-gray-800 font-mono">
                  {id}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">解密密钥</label>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="请输入创建协议时生成的密钥"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleDecrypt}
                  disabled={loading}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? '解密中...' : '解密查看'}
                </button>
                <button
                  type="button"
                  onClick={returnHome}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    协议已成功解密，下方显示协议内容。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">性行为同意协议</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">协议编号</span>
                    <span className="block mt-1">{consentData.id}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">创建日期</span>
                    <span className="block mt-1">{consentData.date}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">参与方信息</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium">参与方1</h5>
                      <p>姓名: {consentData.party1.name}</p>
                      <p>证件号码: {consentData.party1.idNumber}</p>
                      {consentData.party1.contact && (
                        <p>联系方式: {consentData.party1.contact}</p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium">参与方2</h5>
                      <p>姓名: {consentData.party2.name}</p>
                      <p>证件号码: {consentData.party2.idNumber}</p>
                      {consentData.party2.contact && (
                        <p>联系方式: {consentData.party2.contact}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">协议条款</h4>
                  
                  <div className="bg-gray-50 p-4 rounded text-gray-700">
                    <p className="mb-2">双方在完全自愿、清醒、理性，并无任何精神或药物影响的情况下，共同确认并同意以下内容：</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>双方均已达到法定成年年龄，具有完全民事行为能力；</li>
                      <li>双方均自愿参与本次性行为，不存在任何形式的胁迫、欺骗或误导；</li>
                      <li>双方均了解可能的健康风险，并已采取适当的安全措施；</li>
                      <li>双方均尊重对方的身体自主权，同意在任何一方表示不适或拒绝时立即停止；</li>
                      <li>双方均同意对本次行为及相关信息保密，不向第三方泄露；</li>
                      <li>本协议自双方签字确认后生效，有效期为{consentData.validPeriod}。</li>
                    </ol>
                    
                    {consentData.customTerms && (
                      <div className="mt-3">
                        <h5 className="font-medium mb-1">自定义条款：</h5>
                        <p>{consentData.customTerms}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      下载PDF
                    </button>
                    <button
                      type="button"
                      onClick={returnHome}
                      className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      返回首页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDocument; 