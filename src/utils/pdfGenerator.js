import { jsPDF } from 'jspdf';


// 创建带水印的PDF
export const generateConsentPDF = (consentData, signature1, signature2) => {
  try {
    // 创建PDF文档
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    // 定义A4纸张的标准边距和有效内容区域
    const margin = {
      top: 20,    // 上边距
      right: 20,  // 右边距
      bottom: 20, // 下边距
      left: 25    // 左边距
    };
    
    // 有效内容区域宽度（A4纸宽度210mm减去左右边距）
    const contentWidth = 210 - margin.left - margin.right;
    
    // PDF页面高度（A4纸高度297mm）
    const pageHeight = 297;

    // 设置文档元数据
    doc.setProperties({
      title: '性行为同意协议',
      subject: '性行为同意协议文档',
      creator: '性行为同意协议系统',
      author: '系统生成',
      keywords: '同意协议,数字签名,加密'
    });

    // 使用Canvas渲染文本并添加到PDF，支持自动换行
    const addTextAsImage = (text, x, y, width, fontSize, fontWeight = 'normal') => {
      // 创建Canvas元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 计算每行可以容纳的字符数（粗略估计）
      const charsPerLine = Math.floor(width / (fontSize * 0.6));
      
      // 分割文本为多行
      const lines = [];
      if (text.length <= charsPerLine) {
        lines.push(text);
      } else {
        // 简单的文本分行逻辑
        let remainingText = text;
        while (remainingText.length > 0) {
          let lineText;
          if (remainingText.length <= charsPerLine) {
            lineText = remainingText;
            remainingText = '';
          } else {
            // 尝试在空格或标点符号处换行
            let breakPoint = charsPerLine;
            while (breakPoint > 0 && 
                  !/[\s,，.。:：;；!！?？、]/.test(remainingText.charAt(breakPoint))) {
              breakPoint--;
            }
            // 如果找不到合适的断点，就在最大字符数处强制换行
            if (breakPoint === 0) breakPoint = charsPerLine;
            lineText = remainingText.substring(0, breakPoint + 1);
            remainingText = remainingText.substring(breakPoint + 1);
          }
          lines.push(lineText);
        }
      }
      
      // 设置Canvas大小
      const scale = 3; // 提高缩放比例，增加清晰度
      canvas.width = width * scale;
      canvas.height = (fontSize * 1.5 * lines.length) * scale;
      
      // 设置Canvas背景为透明
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制文本
      ctx.fillStyle = 'black';
      const fontStyle = fontWeight === 'bold' ? 'bold' : 'normal';
      ctx.font = `${fontStyle} ${fontSize * scale}px SimSun, "Microsoft YaHei", sans-serif`;
      ctx.textBaseline = 'top';
      
      // 绘制多行文本
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 0, i * fontSize * 1.5 * scale);
      }
      
      // 将Canvas转换为图片并添加到PDF
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (fontSize * 1.5 * lines.length);
      doc.addImage(imgData, 'PNG', x, y, width, imgHeight);
      
      // 返回文本高度，用于计算下一个元素的位置
      return imgHeight;
    };

    // 检查并在必要时添加新页面
    const checkAndAddNewPage = (currentY) => {
      if (currentY > pageHeight - margin.bottom - 20) {
        doc.addPage();
        return margin.top;
      }
      return currentY;
    };

    // 添加标题
    let currentY = margin.top;
    addTextAsImage('性行为同意协议', (210 - 80) / 2, currentY, 80, 10, 'bold');
    currentY += 25;

    // 添加协议编号和日期
    addTextAsImage(`协议编号: ${consentData.id}`, margin.left, currentY, contentWidth, 4);
    currentY += 12;
    addTextAsImage(`创建日期: ${consentData.date}`, margin.left, currentY, contentWidth, 4);
    currentY += 15;

    // 添加参与方信息标题
    addTextAsImage('参与方信息', margin.left, currentY, contentWidth, 5, 'bold');
    currentY += 15;

    // 添加参与方1信息
    addTextAsImage(`参与方1: ${consentData.party1.name}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 13;
    addTextAsImage(`证件号码: ${consentData.party1.idNumber}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 13;
    addTextAsImage(`联系方式: ${consentData.party1.contact}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 15;

    // 添加参与方2信息
    addTextAsImage(`参与方2: ${consentData.party2.name}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 13;
    addTextAsImage(`证件号码: ${consentData.party2.idNumber}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 13;
    addTextAsImage(`联系方式: ${consentData.party2.contact}`, margin.left + 5, currentY, contentWidth - 10, 5);
    currentY += 18;

    // 添加协议内容标题
    currentY = checkAndAddNewPage(currentY);
    addTextAsImage('协议内容', margin.left, currentY, contentWidth, 5, 'bold');
    currentY += 15;
    
    // 创建协议内容文本
    const agreementText = `
双方在完全自愿、清醒、理性，并无任何精神或药物影响的情况下，共同确认并同意以下内容：

1. 双方均已达到法定成年年龄，具有完全民事行为能力；
2. 双方均自愿参与本次性行为，不存在任何形式的胁迫、欺骗或误导；
3. 双方均了解可能的健康风险，并已采取适当的安全措施；
4. 双方均尊重对方的身体自主权，同意在任何一方表示不适或拒绝时立即停止；
5. 双方均同意对本次行为及相关信息保密，不向第三方泄露；
6. 本协议自双方签字确认后生效，有效期为${consentData.validPeriod || '24小时'}。
    `;
    
    // 分段显示长文本
    const paragraphs = agreementText.trim().split('\n');
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].trim()) {
        currentY = checkAndAddNewPage(currentY);
        const textHeight = addTextAsImage(paragraphs[i].trim(), margin.left, currentY, contentWidth, 4);
        currentY += textHeight + 5; // 段落间距
      }
    }

    // 添加签名部分
    currentY = checkAndAddNewPage(currentY);
    currentY += 15;
    addTextAsImage('参与方签名确认', margin.left, currentY, contentWidth, 5, 'bold');
    currentY += 20;

    // 计算签名区域的布局
    const signatureWidth = 70;
    const signatureHeight = 30;
    const signaturePadding = 10;
    
    // 添加参与方1签名
    addTextAsImage('参与方1签名:', margin.left, currentY, contentWidth / 2 - signaturePadding, 5);
    if (signature1) {
      doc.addImage(signature1, 'PNG', margin.left, currentY + 5, signatureWidth, signatureHeight);
    }
    
    // 添加参与方2签名（在同一行）
    addTextAsImage('参与方2签名:', margin.left + contentWidth / 2, currentY, contentWidth / 2 - signaturePadding, 5);
    if (signature2) {
      doc.addImage(signature2, 'PNG', margin.left + contentWidth / 2, currentY + 5, signatureWidth, signatureHeight);
    }
    
    currentY += signatureHeight + 15;

    // 添加签名日期
    addTextAsImage(`签署日期: ${consentData.date}`, margin.left, currentY, contentWidth, 5);

    // 添加水印
    addWatermarkAsImage(doc, consentData.id);

    // 添加页脚
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      // 页码位于页面底部中央
      addTextAsImage(`第 ${i} 页，共 ${totalPages} 页`, (210 - 50) / 2, pageHeight - margin.bottom, 50, 5);
      addTextAsImage('本文档已加密并受法律保护', (250 - 100) / 2, pageHeight - margin.bottom + 8, 100, 5);
    }

    return doc;
  } catch (error) {
    console.error('PDF生成失败:', error);
    return null;
  }
};

// 添加水印图片函数
const addWatermarkAsImage = (doc, id) => {
  try {
    const totalPages = doc.internal.getNumberOfPages();
    const watermarkText = `同意协议 ${id}`;
    
    // 创建水印Canvas
    const createWatermarkImage = (text, angle) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 增加水印尺寸和清晰度
      canvas.width = 300;
      canvas.height = 150;
      
      // 设置Canvas透明背景
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 旋转Canvas
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-canvas.width/2, -canvas.height/2);
      
      // 绘制文本
      ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'; // 稍微调整透明度
      ctx.font = '20px SimSun, "Microsoft YaHei", sans-serif';
      ctx.fillText(text, 40, 75);
      
      return canvas.toDataURL('image/png');
    };
    
    const watermarkImg = createWatermarkImage(watermarkText, -30);
    
    // 优化水印分布，使其覆盖整个页面但不过于密集
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // 在页面不同位置添加水印图片
      for (let j = 50; j < 250; j += 80) {
        for (let k = 30; k < 180; k += 80) {
          doc.addImage(watermarkImg, 'PNG', k, j, 80, 40);
        }
      }
    }
  } catch (error) {
    console.error('添加水印失败:', error);
  }
};

// 下载PDF文件
export const downloadPDF = (doc, filename = 'consent-agreement.pdf') => {
  if (!doc) return false;
  
  try {
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('PDF下载失败:', error);
    return false;
  }
}; 