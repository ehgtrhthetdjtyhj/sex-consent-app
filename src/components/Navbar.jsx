import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">性行为同意协议系统</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-200 transition-colors">首页</Link>
          <Link to="/create-consent" className="hover:text-indigo-200 transition-colors">创建协议</Link>
          <Link to="/verify" className="hover:text-indigo-200 transition-colors">验证协议</Link>
          <Link to="https://github.com/muzihuaner/sex-consent-app" className="hover:text-indigo-200 transition-colors">Github</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 