import React, { useRef, useEffect } from 'react';
import SignaturePadLib from 'signature_pad';

const SignaturePad = ({ onSave, label = "请在此处签名" }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      
      // 设置canvas的尺寸以适应高DPI屏幕
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      
      // 初始化SignaturePad
      signaturePadRef.current = new SignaturePadLib(canvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 0.5,
        maxWidth: 2.5,
      });
    }
    
    // 组件卸载时清理
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  // 清除签名
  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  // 保存签名
  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL("image/png");
      onSave(dataURL);
    } else {
      alert("请先签名");
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-gray-700 font-medium">{label}</label>
      <div className="signature-pad-container bg-white">
        <canvas ref={canvasRef} className="signature-pad" />
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handleClear}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          清除
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          确认签名
        </button>
      </div>
    </div>
  );
};

export default SignaturePad; 