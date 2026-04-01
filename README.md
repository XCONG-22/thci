# thci

本仓库包含课程相关页面与 **排版智能分析器（Typography & Grid Detector）** 完整源码。

## 排版智能分析器（本地打开网站）

源码目录：`typography-grid-detector/`（**请在该目录内**执行 npm 命令，不要在仓库根目录执行）。

### Windows（PowerShell）

```powershell
cd typography-grid-detector
npm install
npm run dev
```

在浏览器打开：**http://localhost:3010/**（开发端口已固定为 3010）。

也可双击项目内的 **`启动开发.bat`**。

### 可选：云端识图 API

复制 `.env.local.example` 为 `.env.local`，按说明填入 `OPENAI_API_KEY` 等；**不要将 `.env.local` 提交到 Git**。不配密钥时仍可使用本机字库、画布叠加与 SVG 导出等功能。

### 静态演示稿（带截图幻灯）

开发服务器运行后访问：

`http://localhost:3010/Typography-Grid-Analyzer-Deck-Screenshots.html`

截图请放在 `typography-grid-detector/public/presentation-assets/`，文件名与 HTML 中引用一致。

### 其它目录

- `presentation/`：演示文稿 HTML / 大纲（可单独下载浏览）
- `interaction/`：课程 interaction 页面

## 小组成员

陈清扬（MC569302）、李伊萱（MC569245）
