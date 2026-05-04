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

### 在线打开同一套演示稿（GitHub Pages）

仓库中的 **`docs/`** 目录放的是同一 HTML 幻灯，用于在 **GitHub 网站** 上直接浏览（无需运行 Node）。

1. 打开 GitHub 仓库 **Settings → Pages**。  
2. **Build and deployment**：Source 选 **Deploy from a branch**，Branch 选 **`main`**，文件夹选 **`/docs`**，保存。  
3. 等待一两分钟后访问：**https://xcong-22.github.io/thci/**（或同一地址下的 `Typography-Grid-Analyzer-Deck-Screenshots.html`）。

若幻灯里图片空白，请将 PNG 截图提交到 **`docs/presentation-assets/`**（文件名见该目录内说明）。

### 深海水母 · 手势互动小游戏（GitHub Pages）

在 **Settings → Pages** 中已选择 **`/docs`** 作为发布源时，可在浏览器直接打开（需 HTTPS，并允许摄像头）：

**https://xcong-22.github.io/thci/game/index.html**

页面源码为单文件：**`docs/game/index.html`**（使用 MediaPipe Hands 官方 CDN）。

### 其它目录

- `presentation/`：演示文稿 HTML / 大纲（可单独下载浏览）
- `interaction/`：课程 interaction 页面

### 橙色小鱼 · 手势互动（GitHub Pages）

在 **Settings → Pages** 中已选择 **`/docs`** 作为发布源时，可在浏览器直接打开（需 HTTPS，并允许摄像头）：

**https://xcong-22.github.io/thci/interaction/**

页面源码为单文件：**`docs/interaction/index.html`**（使用 MediaPipe Hands 官方 CDN）。

## 小组成员

陈清扬（MC569302）、李伊萱（MC569245）
