import CryptoJS from 'crypto-js';

// 安全密钥生成
export const generateSecureKey = () => {
  const length = 32; // 256位
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  
  randomValues.forEach(value => {
    result += chars.charAt(value % chars.length);
  });
  
  return result;
};

// 加密数据
export const encryptData = (data, key) => {
  try {
    if (!data || !key) return null;
    
    // 将数据转换为JSON字符串
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 使用AES加密
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    
    return encrypted;
  } catch (error) {
    console.error('加密失败:', error);
    return null;
  }
};

// 解密数据
export const decryptData = (encryptedData, key) => {
  try {
    if (!encryptedData || !key) return null;
    
    // 使用AES解密
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    // 尝试解析JSON
    try {
      return JSON.parse(decryptedString);
    } catch {
      // 如果不是JSON，则直接返回解密后的字符串
      return decryptedString;
    }
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};

// 生成唯一ID
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
};

// 生成验证码
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 