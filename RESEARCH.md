# HTTP Proxy 方案評估

## 評估的方案

### 1. mitmproxy (Python)
**優點：**
- 專業的 HTTP/HTTPS 代理工具
- 強大的 scripting API
- 成熟穩定，、社區活躍

**缺點：**
- 需要 Python 環境
- 學習曲線較陡
- 主要設計用於 HTTPS 中間人攻擊，HTTP 相對簡單但功能過剩

**評分：⭐⭐⭐☆**

### 2. Node.js http-proxy
**優點：**
- JavaScript/Node.js 生態豐富
- 容易與前端技術整合
- 效能好

**缺點：**
- http-proxy 主要用於代理，需要額外處理 response 修改

**評分：⭐⭐⭐⭐☆**

### 3. Custom Node.js Proxy + Cheerio
**優點：**
- 完全自定義控制
- Cheerio 提供 jQuery 風格的 HTML 操作
- 可靈活實現各種修改邏輯

**缺點：**
- 需要自己處理所有 HTTP 細節
- 可能需要處理並發、緩衝等問題

**評分：⭐⭐⭐⭐⭐**

### 4. Squid Proxy
**優點：**
- 企業級 Proxy 解決方案
- 穩定高效

**缺點：**
- 配置複雜
- 修改 HTML 需要額外插件或 script
- 不夠靈活

**評分：⭐⭐☆☆☆**

## 結論

選擇 **方案 3：Custom Node.js Proxy + Cheerio**

原因：
1. 完全可控
2. Cheerio 適合 DOM 操作（替換 icon、文字、表格）
3. Node.js 效能好
4. 適合持續開發和迭代

## 實現計劃

1. 建立基礎 HTTP Proxy
2. 攔截 HTTP Response
3. 使用 Cheerio 解析 HTML
4. 實現修改邏輯（替換文字、圖片、表格）
5. 回傳修改後的 HTML