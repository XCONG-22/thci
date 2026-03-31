# 排版智能分析器 · 课堂演示文稿

**Typography & Grid Analyzer — bilingual slide deck (HTML + PDF)**

## 仓库与作者

- 目标仓库：<https://github.com/XCONG-22/thci>
- 组员：陈清扬（MC569302）、李伊萱（MC569245）

## 文件说明

| 文件 | 说明 |
|------|------|
| `Typography-Grid-Analyzer-Deck-Screenshots.html` | 浏览器演示稿（← → 或空格翻页） |
| `Typography-Grid-Analyzer-Deck-Screenshots.pdf` | 导出 PDF（若已一并上传） |
| `presentation-assets/*.png` | 界面截图资源（**必须与 HTML 同目录结构**） |
| `Typography-Grid-Analyzer-Presentation-Deck.md` | 讲演大纲与版式说明（可选） |

## 本地打开

1. 将整个 `presentation` 文件夹下载到本地。
2. 双击打开 `Typography-Grid-Analyzer-Deck-Screenshots.html`（勿只复制单个 HTML，需保留 `presentation-assets` 文件夹）。

## 推送到 GitHub（需已安装 Git 并有权限）

在**本仓库根目录**（与 `interaction` 同级）下建议将本内容放在 `presentation/` 目录：

```bash
git clone https://github.com/XCONG-22/thci.git
cd thci
# 将本 package 内 presentation 文件夹内容复制到仓库的 presentation/ 下
git add presentation/
git commit -m "Add Typography & Grid Analyzer bilingual presentation (HTML, PDF, assets)"
git push origin main
```

若使用 **Personal Access Token**，在提示密码处粘贴 Token。
