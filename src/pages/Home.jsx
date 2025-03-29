import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">欢迎使用性行为同意协议系统</h1>
        <p className="text-xl text-gray-600 mb-8">
          提供安全、加密的电子同意协议，保护您的隐私和权益
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/create-consent"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            创建新协议
          </Link>
          <Link
            to="/verify"
            className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            验证协议
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">为什么选择我们的系统？</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">数据安全加密</h3>
            <p className="text-gray-600">
              所有敏感数据均使用高级加密存储，确保您的隐私安全
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">PDF水印保护</h3>
            <p className="text-gray-600">
              导出的PDF文件带有独特水印，防止未授权复制和传播
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">电子签名验证</h3>
            <p className="text-gray-600">
              支持手写电子签名，确保协议真实性和不可篡改性
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">使用说明</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li className="pl-2"><span className="font-medium text-indigo-600">填写表单</span> - 创建新协议并填写所有必要信息</li>
          <li className="pl-2"><span className="font-medium text-indigo-600">电子签名</span> - 双方在协议上签字确认</li>
          <li className="pl-2"><span className="font-medium text-indigo-600">生成PDF</span> - 系统自动生成带水印的PDF文档</li>
          <li className="pl-2"><span className="font-medium text-indigo-600">保存协议</span> - 保存加密协议信息，可在未来验证</li>
        </ol>
      </section>
    </div>
  );
};

export default Home; 