import { encryptData, decryptData } from '../utils/encryption';

const STORAGE_KEY = 'consent_agreements';

// 保存协议到localStorage
export const saveConsent = (consentData, secretKey) => {
  try {
    if (!consentData || !consentData.id) {
      console.error('无效的协议数据');
      return false;
    }

    // 获取现有数据
    const existingData = localStorage.getItem(STORAGE_KEY);
    let agreements = existingData ? JSON.parse(existingData) : {};

    // 加密协议数据
    const encryptedData = encryptData(consentData, secretKey);
    if (!encryptedData) {
      console.error('协议加密失败');
      return false;
    }

    // 存储加密后的数据和关键信息
    agreements[consentData.id] = {
      encryptedData,
      createDate: new Date().toISOString(),
      // 只存储必要的元数据，不存储实际内容
      metadata: {
        id: consentData.id,
        date: consentData.date,
        validPeriod: consentData.validPeriod
      }
    };

    // 保存回localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
    return true;
  } catch (error) {
    console.error('保存协议失败:', error);
    return false;
  }
};

// 获取协议列表（仅元数据，不含实际内容）
export const getConsentList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const agreements = JSON.parse(data);
    
    // 只返回元数据列表
    return Object.values(agreements).map(agreement => ({
      ...agreement.metadata,
      createDate: agreement.createDate
    }));
  } catch (error) {
    console.error('获取协议列表失败:', error);
    return [];
  }
};

// 获取加密的协议数据
export const getEncryptedConsent = (id) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const agreements = JSON.parse(data);
    return agreements[id]?.encryptedData || null;
  } catch (error) {
    console.error('获取加密协议失败:', error);
    return null;
  }
};

// 解密并获取完整协议内容
export const getDecryptedConsent = (id, secretKey) => {
  try {
    const encryptedData = getEncryptedConsent(id);
    if (!encryptedData) return null;

    // 尝试解密
    const decryptedData = decryptData(encryptedData, secretKey);
    if (!decryptedData) {
      console.error('解密失败，密钥可能不正确');
      return null;
    }

    return decryptedData;
  } catch (error) {
    console.error('获取解密协议失败:', error);
    return null;
  }
};

// 删除协议
export const deleteConsent = (id) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return false;

    const agreements = JSON.parse(data);
    if (!agreements[id]) return false;

    // 删除指定ID的协议
    delete agreements[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
    return true;
  } catch (error) {
    console.error('删除协议失败:', error);
    return false;
  }
}; 