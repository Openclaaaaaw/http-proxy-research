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

## 已實現功能

### 核心功能
- ✅ 基礎 HTTP Proxy 伺服器
- ✅ HTML Response 攔截
- ✅ 使用 Cheerio 解析和修改 HTML

### 修改功能
- ✅ 文字替換 (replaceText)
- ✅ 圖片/Icon 替換 (replaceImages)
- ✅ 表格樣式修改 (modifyTables)
- ✅ 自定義 CSS 注入 (injectCSS)
- ✅ 添加 CSS 類別 (addClasses)
- ✅ 移除元素 (removeElements)

### 系統功能
- ✅ 配置系統 (config.js)
- ✅ 日誌系統 (Logger)
- ✅ Middleware 中間件系統
- ✅ Filter 過濾系統
- ✅ RuleEngine 規則引擎
- ✅ CLI 命令列介面

## 項目結構

```
http-proxy-research/
├── proxy.js              # 主代理伺服器
├── config.js             # 配置和修改規則
├── cli.js                # 命令列工具
├── package.json          # NPM 配置
├── README.md            # 文檔
├── RESEARCH.md           # 本研究文檔
├── test-server.js        # 本地測試伺服器
├── test-proxy.js         # 代理測試腳本
├── lib/
│   ├── HtmlModifier.js  # HTML 修改核心類
│   ├── Logger.js         # 日誌工具
│   ├── Middleware.js     # 中間件系統
│   ├── Filter.js        # 過濾系統
│   └── RuleEngine.js    # 規則引擎
└── examples/
    └── middleware-example.js  # 中間件示例
```

## 使用方法

```bash
# 安裝依賴
npm install

# 啟動代理
npm start
# 或使用 CLI
node cli.js start --port 8080 --target http://example.com

# 測試
node test-server.js  # 終端 1
node test-proxy.js   # 終端 2
```

## 配置示例

```javascript
modifications: {
  replaceText: {
    'Hello': 'Hello (Modified!)',
    'Example': 'Demo'
  },
  replaceImages: {
    'icon': 'https://example.com/new-icon.png'
  },
  modifyTables: true,
  injectCSS: 'body { background: #f0f0f0; }'
}
```

## 下一步

- [ ] 實現 HTTPS 代理（需要 SSL/TLS 證書）
- [ ] 添加 Web UI 配置界面
- [ ] 支援更多 HTML 修改功能
- [ ] 性能優化
- [ ] 單元測試