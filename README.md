# Google 表格数据源版文案复制器

这是一个纯 HTML、CSS、JavaScript 的静态网页，适合部署到 GitHub Pages。网页会读取公开的 Google Sheets CSV，不再把文案写死在 `index.html`。

## 文件结构

只需要保留这 3 个文件：

```text
index.html
README.md
.nojekyll
```

## 1. 创建 Google 表格

1. 打开 Google Sheets。
2. 新建一个空白表格。
3. 第一行字段名必须是：

```text
编号, 可复制文案, 中文注释
```

网页只会复制「可复制文案」这一列。「中文注释」会显示在页面上，方便查看中文翻译，但不会被复制。「编号」也不会被复制。

## 2. 发布 Google 表格为 CSV

1. 在 Google 表格顶部点击「文件」。
2. 点击「共享」。
3. 点击「发布到网络」。
4. 选择要发布的工作表。
5. 格式选择「逗号分隔值 (.csv)」。
6. 点击「发布」。
7. 复制生成的 CSV 链接。

这个 CSV 链接必须公开可访问。

## 3. 把 CSV 链接填入 index.html

打开 `index.html`，找到这一行：

```js
const SHEET_CSV_URL = "这里填写我的 Google Sheets CSV 发布链接";
```

把引号里的内容替换成你的 CSV 发布链接，例如：

```js
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/xxxxx/pub?output=csv";
```

## 4. 部署到 GitHub Pages

1. 把 `index.html`、`README.md`、`.nojekyll` 上传到 GitHub 仓库。
2. 打开仓库 Settings。
3. 进入 Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 生成网址。

## 5. 以后如何更新文案

以后只需要修改 Google 表格，不需要修改 HTML。

网页打开时会自动读取 CSV。点击「刷新表格数据」时，会重新 fetch Google Sheets CSV，并加上时间戳避免缓存。

## 6. iPhone 添加到主屏幕

1. 用 iPhone Safari 打开 GitHub Pages 网页。
2. 点击底部分享按钮。
3. 选择「添加到主屏幕」。
4. 名称可以填写「文案复制器」。
5. 点击「添加」。

之后就可以像 App 一样从主屏幕打开。复制失败时，页面会提示长按文本框手动复制。
