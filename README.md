# Google 表格数据源版文案复制器

这是一个纯 HTML、CSS、JavaScript 的静态网页，适合部署到 GitHub Pages。页面分成两个独立模块：

- 文案复制：读取文案表格，复制「可复制文案」，显示「中文注释」。
- 挂车链接：读取商品表格，显示商品名，自动把 PID 拼成 TikTok 商品链接。

## 文件结构

上传到 GitHub 时只需要这 3 个文件：

```text
index.html
README.md
.nojekyll
```

## 1. 文案表字段

文案表第一行字段名必须是：

```text
编号, 可复制文案, 中文注释
```

网页只会复制「可复制文案」这一列。「中文注释」会显示在页面上，方便查看中文翻译，但不会被复制。「编号」也不会被复制。

## 2. 挂车商品表字段

挂车商品表第一行字段名必须是：

```text
编号, 商品名, PID
```

PID 只需要填写商品链接最后那串数字。例如这个链接：

```text
https://shop.tiktok.com/view/product/1732310379963912533
```

表格里 PID 只填：

```text
1732310379963912533
```

网页会自动拼成完整链接：

```text
https://shop.tiktok.com/view/product/1732310379963912533
```

## 3. 发布 Google 表格为 CSV

两个模块各需要一个 CSV 链接。可以放在同一个 Google 表格文件里的两个工作表，然后分别发布为 CSV。

发布步骤：

1. 在 Google 表格顶部点击「文件」。
2. 点击「共享」。
3. 点击「发布到网络」。
4. 选择要发布的工作表。
5. 格式选择「逗号分隔值 (.csv)」。
6. 点击「发布」。
7. 复制生成的 CSV 链接。

## 4. 把 CSV 链接填入 index.html

打开 `index.html`，文案表链接填这里：

```js
const CAPTION_SHEET_CSV_URL = "你的文案表 CSV 链接";
```

挂车商品表链接填这里：

```js
const PRODUCT_SHEET_CSV_URL = "你的挂车商品表 CSV 链接";
```

## 5. 部署到 GitHub Pages

1. 把 `index.html`、`README.md`、`.nojekyll` 上传到 GitHub 仓库。
2. 打开仓库 Settings。
3. 进入 Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 生成网址。

## 6. 以后如何更新

以后只需要修改 Google 表格，不需要修改 HTML。

页面里的「刷新文案表格」和「刷新商品表格」都会重新读取 Google Sheets CSV，并加时间戳避免缓存。

## 7. iPhone 添加到主屏幕

1. 用 iPhone Safari 打开 GitHub Pages 网页。
2. 点击底部分享按钮。
3. 选择「添加到主屏幕」。
4. 名称可以填写「文案复制器」。
5. 点击「添加」。

之后就可以像 App 一样从主屏幕打开。
