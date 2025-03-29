import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 text-gray-600 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>© {year} 欢哥科技</p>
        <p className="mt-2 text-sm">
        本应用仅作为技术演示，所有数据均进行加密处理，保障用户隐私，在实际法律场景中的有效性可能因地区而异。请遵循当地法律法规使用。
        </p>
      </div>
    </footer>
  );
};

export default Footer; 