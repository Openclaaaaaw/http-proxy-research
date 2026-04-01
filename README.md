# HTTP Proxy Server 研究

研究如何建立 HTTP Proxy Server 來修改網頁內容（替換 icon、修改文字等）

## 目標
- 建立 HTTP Proxy Server
- 能夠攔截和修改 HTTP 請求/回應
- 替換頁面中的 icon、文字、表格等元素
- **目標協議：HTTP**（非 HTTPS）

## 研究階段

### 階段 1：方案評估 ✅
- [ ] mitmproxy（Python）
- [ ] Node.js http-proxy
- [ ] Squid + custom configuration
- [ ] Browser Extension

### 階段 2：原型開發
- [ ] 實現基本 HTTP Proxy
- [ ] 實現 response 修改
- [ ] 測試頁面修改功能

### 階段 3：優化
- [ ] 效能優化
- [ ] 配置界面
- [ ] 部署腳本

## 為什麼不用 HTTPS？
HTTPS 需要 MITM 證書，會比較複雜。我們先專注 HTTP。
