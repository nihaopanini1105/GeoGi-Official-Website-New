# GeoGi Official Website Development Guidelines

本规范是 `GeoGi-Official-Website-New` 的长期开发与发布规则。除非 GeoGi 负责人明确批准更新品牌、产品边界或内容策略，所有页面、组件、文案、图片、研究中心文章、自动化脚本和发布流程都必须遵守本文件与 `docs/WEBSITE_V9_IMPLEMENTATION_PLAN.md`。

## 1. Repository Role And Source Of Truth

GeoGi 官网负责公开展示，不自行定义产品事实。

权威关系：

- `nihaopanini1105/GeoGi-OS`：产品能力、方法、证据、版本、工作流、QA、Report 与交付边界的权威来源。
- `nihaopanini1105/GeoGi-Content-OS`：研究选题、内容生产、平台路由、视觉与内容审核的权威来源。
- `nihaopanini1105/GeoGi-MiniProgram`：当前客户入口、用户侧交互与已批准联系方式的参考来源。
- `nihaopanini1105/GeoGi-Official-Website-New`：公开官网与 Research Center 的开发主仓。
- Gitee `sanshen-tech/geogi_order_web`：中国团队发布 / 部署仓，不作为独立产品事实源。

任何官网内容不得自行发明：

- 正式综合评分权重或平台权重；
- 未经批准的客户等级；
- AI 平台内部算法、候选池或排名机制；
- 保证推荐、保证排名、保证效果或固定生效周期；
- 尚未实现的 SaaS、API、Reader、自动平台执行、数据库、CMS 或其他生产 runtime 能力。

## 2. Canonical Branch And Remote Model

正常开发只以 GitHub 为开发主仓。

本地标准 remote：

```text
origin -> git@github.com:nihaopanini1105/GeoGi-Official-Website-New.git
gitee  -> git@gitee.com:sanshen-tech/geogi_order_web.git
```

当前 Gitee 生产分支为：

```text
gitee/master
```

GitHub 分支模型：

```text
feature/* or feat/*
        ↓
GitHub Draft PR
        ↓
QA / Review
        ↓
GitHub main
```

禁止直接在 GitHub `main` 上进行日常开发。

Gitee 目标发布模型：

```text
GitHub main
        ↓
Gitee release/github-main
        ↓
团队验收
        ↓
Gitee master
        ↓
生产
```

在自动同步机制正式建立前，不允许为了“保持一致”直接覆盖 Gitee `master`。

## 3. Current v9 Development Entry

v9 正式开发入口：

```text
branch: feat/website-v9-launch-clean
PR: #1 GeoGi Website v9 Launch Candidate
```

该 PR 在所有 P0 上线阻塞项解决前必须保持 Draft。

历史保护分支、旧 ZIP 恢复记录和 Gitee 生产历史只用于追溯，不作为新的开发起点。

## 4. Development Principles

### 4.1 保持品牌一致

新增页面和模块必须继承现有 GeoGi 视觉语言：

- 正式 GeoGi Orbit Answer Logo 原始资产；
- 已确认的蓝色 / 深蓝 / 青色辅助视觉体系；
- 现有圆角、卡片、留白、字体层级和研究出版物风格；
- 中文主叙事，英文只用于必要术语或方法论名称。

禁止：

- AI 重绘 Logo；
- 近似 Logo、旧 Logo、错误字标；
- 为单篇文章另起一套视觉系统；
- 为解决局部问题不断叠加新的 `!important` 补丁。

### 4.2 小步、可审计更新

每次提交只完成一个清晰目的，例如：

- front-end foundation；
- homepage product truth；
- Research Center data model；
- research publishing QA；
- contact assets；
- release automation；
- launch QA。

不要把无关重构、文案修改和发布配置混在一个提交中。

### 4.3 事实优先

官网产品文案先与 `GeoGi-OS` 当前正式能力核对，再考虑营销表达。

对外表达优先描述：

- 真实用户问题；
- 多平台受控观察；
- 原始回答与来源；
- 事实 / 引用核验；
- 品牌与竞品诊断；
- 优化方案与执行验收；
- 同口径复测；
- 可比性、限制条件与归因支持；
- 报告 QA 与交付。

避免将内部 Schema、Registry、对象名或工作流实现细节直接暴露给客户。

## 5. China-Market Service Boundary

GeoGi 当前 GEO 服务范围以中国市场为核心。

官网必须清楚区分：

- **服务范围**：中国市场品牌 GEO 诊断、优化、复测与持续增长；
- **研究引用范围**：可引用全球公开论文、官方文档和国际平台资料用于概念研究。

国际研究来源不等于 GeoGi 当前提供海外平台检测服务。

国内 AI 平台示例可以包含豆包、腾讯元宝、通义千问、DeepSeek、Kimi，但具体项目正式覆盖范围必须以当前验证状态和项目方案为准，不得默认宣称所有项目均完成五平台正式可比测试。

## 6. Scoring And Outcome Language

在 GeoGi-OS 尚未批准正式综合权重前，官网统一使用：

- 诊断维度；
- 观察指标；
- 平台表现；
- 竞品对比；
- 风险；
- 机会；
- 变化评估。

禁止将未经正式批准的轻量展示分数描述为 GeoGi 正式综合总分。

复测统一使用“观察 / 比较 / 评估”语言。

推荐表达：

> 按同口径复测，比较前后变化，并评估可比性、限制条件与归因支持。

禁止表达：

> 复测证明本次优化一定有效。

## 7. Research Center Standard

### 7.1 Canonical route

Research Center canonical 根路径固定为：

```text
/insights/
```

新文章目标路由：

```text
/insights/<slug>/
```

历史 `/research/` URL 只用于已经公开 URL 的兼容重定向，不再作为新内容的第二套 canonical 体系。

### 7.2 Fixed categories

一级分类固定为：

1. GEO 基础研究
2. AI 平台研究
3. GeoGi 方法论
4. 行业研究
5. 年度研究报告

其他主题如品牌 AI 可见度、Citation、竞品、案例、事实库等使用 tags / topics 表达。

### 7.3 Target content source

v9 Research Center 逐步迁移到：

```text
content/
  research/
    <slug>/
      article.md
      metadata.json
      assets/
```

文章 HTML 是构建产物，不作为长期手工维护的唯一母稿。

### 7.4 Required metadata

每篇文章至少包含：

- slug；
- title；
- description；
- published_at；
- updated_at；
- author；
- category；
- tags；
- status；
- canonical_path；
- sources；
- FAQ（如有）；
- featured 状态。

### 7.5 Research article structure

文章建议保持：

- 研究摘要；
- 核心结论；
- 研究正文；
- 数据 / 模型 / 案例；
- GeoGi 原创框架；
- GeoGi Research Insight / Perspective；
- FAQ；
- References；
- Related Articles；
- CTA。

事实、外部研究结论和 GeoGi 自有观点必须可区分。

## 8. Research Publishing Workflow

网站研究内容不直接从公众号 HTML 复制上线。

目标流程：

```text
Trend Research
→ Website Research Draft
→ Content Review
→ Human Approval
→ Website Research Package
→ Website Build / QA
→ GitHub PR
→ Preview / QA
→ Merge
→ Gitee release candidate
→ Human production approval
```

未经人工批准的研究内容不得自动进入生产。

Research build 后续应自动生成 / 更新：

- 文章详情页；
- `/insights/index.html`；
- 分类页；
- 首页最新 3 篇；
- Related Articles；
- `sitemap.xml`；
- `feed.xml`；
- 可选 `research-feed.json`。

## 9. Contact And Social Rules

联系方式必须使用独立正式资产，不允许继续把 QR 作为 Base64 写死在 HTML。

目标结构：

```text
assets/contact/
  wecom-qr.png
  wechat-official-qr.png
  xiaohongshu-qr.png

data/
  contact.json
```

渠道定位：

- 企业微信：商务咨询 / 项目沟通；
- 微信公众号：GeoGi 研究与方法内容；
- 小红书：实验、案例与行业观察。

只允许使用已批准官方二维码与账号信息。没有已确认资产时隐藏该渠道，不制作假二维码或占位二维码进入生产。

## 10. Front-End Rules

v9 目标是保留现有视觉，降低页面内联样式耦合。

目标目录：

```text
assets/
  css/
    tokens.css
    base.css
    components.css
    home.css
    research.css
  js/
    navigation.js
    research.js
```

要求：

- 公共 token 和组件只定义一次；
- 不再累积 v4/v5/v6/v10/v17/v18 相互覆盖的临时 CSS；
- 所有新导航需支持桌面与移动端；
- 不允许移动端直接隐藏全部主导航而没有替代入口；
- 320px 宽度不得出现横向页面溢出；
- 表格、二维码、长标题和 CTA 必须有移动端处理；
- 键盘焦点和基本 aria 属性不得缺失。

## 11. SEO And AI-Readable Requirements

每个生产页面必须检查：

- 唯一 title；
- description；
- canonical；
- robots；
- Open Graph；
- heading hierarchy；
- internal links；
- image alt；
- sitemap inclusion。

研究文章额外检查：

- Article structured data 与可见内容一致；
- FAQ schema 只在页面真实显示相同 FAQ 时存在；
- 日期与 metadata 一致；
- sources / references 可追溯；
- Organization logo 使用正式文件 URL，不使用 Base64 data URI。

## 12. Local Development Safety

正式本地工作目录只认一个：

```text
/Users/dashaoye/Documents/GeoGi_Official_Website/GeoGi-Official-Website-New
```

开发前先执行：

```sh
git status
git branch --show-current
git remote -v
git fetch origin --prune
```

如果存在未提交修改，不允许直接 `reset --hard`、覆盖目录或强制 pull。

如需读取 Gitee：

```sh
git fetch gitee --prune
```

`fetch` 只更新远程引用，不自动合并工作区。

## 13. Quality Gates Before PR Ready

PR 从 Draft 切换到 Ready 前至少满足：

- 所有 P0 阻塞问题解决；
- 产品文案与 GeoGi-OS 当前能力一致；
- 无效果保证 / 排名保证 / 算法臆测；
- 中国市场边界清晰；
- 移动导航可用；
- 桌面 / 移动关键页面通过；
- 无已知 broken links；
- 官方 Logo / 联系方式资产正确；
- Research Center 只有一个 canonical 体系；
- sitemap / feed 与已发布文章一致；
- 自动检查通过，或明确记录无法执行原因。

## 14. Production Release Gate

GitHub PR 合并不等于直接上线。

正式发布必须经过：

```text
GitHub main approved state
→ Gitee release candidate
→ 中国团队验收
→ 明确人工批准
→ Gitee master
→ production
```

生产发布后必须记录：

- GitHub release commit SHA；
- Gitee release / master 对应 commit；
- 发布日期；
- 验收人；
- 已知限制；
- 回滚点。

## 15. Emergency Hotfix

只有生产故障等紧急情况允许优先在 Gitee 修复。

规则：

1. 记录 hotfix commit；
2. 尽快把同一修复 backport 回 GitHub；
3. 通过 GitHub PR 恢复唯一开发事实源；
4. 在下一次正常发布前确认 GitHub / Gitee 没有未解释差异。

禁止长期双向独立开发。
