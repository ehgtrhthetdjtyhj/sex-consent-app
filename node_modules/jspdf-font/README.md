# jspdf 文字插件

[![npm](https://img.shields.io/npm/v/jspdf-font.svg)](https://www.npmjs.com/package/jspdf-font) 
[![LICENSE MIT](https://img.shields.io/npm/l/jspdf-font.svg)](https://www.npmjs.com/package/jspdf-font)

## 功能点 Feature
* 

## 使用 Usage

### npm
```
npm install jspdf-font  --save

import initFont from 'jspdf-font'
initFont(jsPDFAPI, fontFamily)
```

### script
```
<script src="index.js"></script>

const {initFont} = window.jspdfFont
initFont(jsPDFAPI, fontFamily)
```

## 参数 Params
* @param 
* jsPDFAPI: jsPDF.API
* fontFamily: 字体名称，默认'SongtiSCBlack'

## 返回 Return
* fontFamily
