import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEncryptedConsent } from '../services/storageService';

const VerifyConsent = () => {
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 处理验证
  const handleVerify = () => {
    if (!documentId.trim()) {
      setError('请输入协议ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 检查是否存在该ID的加密协议
    const encryptedData = getEncryptedConsent(documentId.trim());
    
    if (!encryptedData) {
      setError('找不到指定ID的协议，请检查ID是否正确');
      setLoading(false);
      return;
    }
    
    // 找到协议，跳转到查看页面
    navigate(`/view/${documentId.trim()}`);
    setLoading(false);
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">验证性行为同意协议</h2>
      </div>
      
      <div className="px-6 py-8">
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  输入协议ID验证协议是否存在。验证通过后，您需要输入解密密钥查看完整内容。
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">协议ID</label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="输入需要验证的协议ID"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? '验证中...' : '验证协议'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                返回首页
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">协议验证说明</h3>
            <div className="bg-gray-50 p-4 rounded">
              <ol className="list-decimal list-inside space-y-2">
                <li className="text-gray-700">输入您需要验证的协议ID</li>
                <li className="text-gray-700">系统会检查该协议是否存在</li>
                <li className="text-gray-700">如果协议存在，您将被引导至查看页面</li>
                <li className="text-gray-700">在查看页面，您需要输入解密密钥才能查看完整协议内容</li>
              </ol>
              <p className="mt-4 text-sm text-gray-500">
                注意：出于隐私保护考虑，系统不会存储解密密钥。如果您忘记了密钥，将无法恢复查看协议内容。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyConsent; 