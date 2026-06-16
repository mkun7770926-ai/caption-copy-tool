# Mark 小工具

这是一个纯 HTML、CSS、JavaScript 的 GitHub Pages 静态网页。页面有 3 个入口：

- 日常发布：复制日常文案。
- 挂车发布：显示商品名，复制挂车文案。
- 挂车链接：根据 PID 自动生成 TikTok 商品链接。

## 上传文件

上传到 GitHub 仓库根目录的文件只有：

```text
index.html
README.md
.nojekyll
```

## Google 表格字段

### 日常发布

第一行字段名：

```text
排序编号, 可复制文案, 中文注释, 语言, 使用时间
```

网页只使用：

```text
排序编号, 可复制文案, 中文注释
```

`语言` 和 `使用时间` 不影响网页，不会被复制。

### 挂车发布

第一行字段名：

```text
排序编号, 商品名称, 可复制文案, 中文注释, 语言, 使用时间
```

网页只使用：

```text
排序编号, 商品名称, 可复制文案, 中文注释
```

复制时只复制「可复制文案」，不会复制商品名、中文注释、语言、使用时间。

### 挂车链接

第一行字段名：

```text
编号, 商品名, PID
```

PID 只需要填写商品链接最后的数字，例如：

```text
1732310379963912533
```

网页会自动拼成：

```text
https://shop.tiktok.com/view/product/1732310379963912533
```

## 发布到 GitHub Pages

1. 上传 `index.html`、`README.md`、`.nojekyll`。
2. 打开 GitHub 仓库 Settings。
3. 进入 Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 生成网址。

以后只需要更新 Google 表格，不需要修改 HTML。
