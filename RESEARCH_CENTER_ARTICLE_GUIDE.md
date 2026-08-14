# Research Center Article Guide

本文件服务 GeoGi 官网研究中心的长期内容发布。正式发布流程以仓库当前的 `_template.md`、`publish-research.js`、Research Registry、Website QA 和 PR 审核为准。

## 1. 新建文章

从模板复制：

```bash
cp content/research/_template.md content/research/<slug>.md
```

`slug` 使用小写英文 kebab-case，例如：

```text
brand-ai-visibility-diagnosis
```

## 2. 必填字段

文章 frontmatter 使用以下正式字段：

```yaml
---
slug: ""
title: ""
description: ""
deck: ""
category: ""
tags: []
author: "GeoGi 研究团队"
published_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
featured: false
status: "draft"
review_status: "pending"
---
```

固定分类仅允许：

- GEO 基础研究
- AI 平台研究
- GeoGi 方法论
- 行业研究
- 年度研究报告

## 3. 草稿与审核

草稿阶段保持：

```yaml
status: "draft"
review_status: "pending"
```

草稿不会进入正式发布流程。

正式发布前必须人工审核事实、来源、表达边界、分类、标题、摘要和正文，并改为：

```yaml
status: "published"
review_status: "approved"
```

只有同时满足 `published + approved` 的文章才允许由发布脚本生成正式页面。

## 4. 正式发布命令

```bash
node scripts/publish-research.js content/research/<slug>.md
```

发布脚本会一次性完成：

1. 校验 frontmatter、分类、日期、标签、审核状态与正文长度；
2. 生成 `insights/<slug>/index.html`；
3. 更新 `data/research-index.json`；
4. 重写研究中心首页的静态文章卡片；
5. 更新研究中心 `CollectionPage` 结构化数据；
6. 更新 `sitemap.xml`。

研究中心同时保留 `assets/js/research-index.js` 作为运行时增强；静态 HTML 是 SEO、无脚本访问和发布可靠性的正式兜底。

## 5. 发布后 QA

提交 PR 前运行：

```bash
node --check scripts/publish-research.js
node --check assets/js/research-index.js
node --check assets/js/contact.js
node scripts/validate-site.js
```

`validate-site.js` 会检查研究分类、已发布路由、canonical、SEO metadata、Research Center 索引、sitemap、联系信息、Logo System v1.0 canonical 资产以及旧迁移文件是否重新出现。

## 6. GitHub 发布流程

正式流程：

```text
研究草稿
→ 人工审核
→ publish-research.js
→ 本地/CI QA
→ Pull Request
→ Website QA 通过
→ merge main
```

不得绕过人工审核直接发布，也不得把 `draft/pending` 内容写入正式 Research Registry。

## 7. 编辑标准

- 标题必须明确研究对象或核心问题，避免空泛标题。
- 摘要应说明“研究什么、为什么重要、读者能获得什么”。
- 公开事实、GeoGi 方法、观察结果和推论必须区分。
- 数据、论文、政策、平台能力与关键外部事实应保留可追溯来源。
- 不将单次 AI 回答包装成长期排名或因果证明。
- 不声称掌握平台未公开算法，不使用未经证实的“首个、唯一、必然、保证”等绝对表述。
- 当前客户 GEO 检测、诊断、优化与复测服务聚焦中国市场；研究可以引用全球公开资料作为背景和方法参考。

## 8. 发布完成检查

确认：文章详情页可访问；Research Center 列表出现文章；canonical 与 sitemap 一致；文章标题、描述、日期、分类和作者正确；页面 Logo 使用冻结的 GeoGi Logo System v1.0；PC 与移动端结构未出现明显断裂；GitHub Website QA 为绿色。

本流程只覆盖 GitHub 官网内容生产与发布门禁，不代表已经完成任何外部发布平台、Gitee 或生产服务器部署。
