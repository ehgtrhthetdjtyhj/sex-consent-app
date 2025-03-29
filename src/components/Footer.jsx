import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 text-gray-600 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>© {year} 性行为同意协议系统 - 保护个人隐私与安全</p>
        <p className="mt-2 text-sm">
          本系统仅提供服务，所有数据均进行加密处理，保障用户隐私
        </p>
      </div>
    </footer>
  );
};

export default Footer; 