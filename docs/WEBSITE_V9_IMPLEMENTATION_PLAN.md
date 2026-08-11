# GeoGi Official Website v9 — Launch Implementation Plan

Status: Draft implementation baseline  
Target branch: `feat/website-v9-launch-clean`  
Release target: GitHub PR → controlled Gitee release candidate → Gitee `master` → production

## 1. Source of truth

GeoGi 官网不是独立定义产品能力的地方。v9 使用以下权威关系：

1. `GeoGi-OS`：产品能力、方法、证据、版本、工作流、QA 与交付边界的权威来源。
2. `GeoGi-Content-OS`：研究选题、平台内容、视觉与发布前内容审核的权威来源。
3. `GeoGi-MiniProgram`：客户入口、当前可公开交互、联系方式和小程序用户侧能力的参考来源。
4. `GeoGi-Official-Website-New`：公开品牌说明、服务说明、研究中心 canonical 内容和转化入口。
5. Gitee `sanshen-tech/geogi_order_web`：中国团队发布/部署仓，不作为独立产品事实源。

官网不得自行发明评分规则、平台权重、效果承诺、算法解释、正式运行时能力或未完成产品。

## 2. Current audit summary

### P0 — blocks production release

#### P0-1 Mobile navigation disappears

Current CSS hides `.nav` below 920px, but no mobile menu or alternative navigation is rendered. Mobile users therefore lose all primary navigation except the logo.

Required fix:
- Add accessible mobile menu button.
- Preserve links to About, Services, Flow, Industries, Research Center, FAQ and Contact.
- Keyboard focus, `aria-expanded`, close-on-navigation and Escape handling required.
- Verify 320/375/390/430px widths.

#### P0-2 Contact block is not maintainable

Current homepage contact QR is embedded as a Base64 data URI and the primary CTA uses `javascript:void(0)`.

Required fix:
- Move official contact assets into `assets/contact/`.
- Do not embed QR codes as Base64 in HTML.
- Add separate presentation for:
  - 企业微信：商务咨询 / 项目沟通
  - 微信公众号：研究与方法内容
  - 小红书：实验、案例与行业观察
- Contact identifiers/QR assets must come from approved official assets; never fabricate them.
- Until an asset is confirmed, keep the channel hidden or explicitly unavailable rather than shipping a placeholder QR.

#### P0-3 Product maturity wording overstates current runtime implementation

The current article describes GeoGi as an “AI 可见度与 GEO 增长平台”. GeoGi-OS `main` currently provides strong contract/governance capability but explicitly does not yet implement production database/API/UI/CMS/Reader/automatic platform execution or full runtime orchestration.

Required public wording:
- Position GeoGi primarily as a China-market GEO diagnosis, optimization and evidence-driven delivery system/service.
- It is acceptable to describe `GeoGi GEO Intelligence OS` as the internal methodology/governance system being built, but do not imply a production SaaS platform exists where it does not.
- Do not expose internal Schema/Registry object names on customer-facing pages.

#### P0-4 Retest wording must not imply causal proof

Current copy includes language equivalent to “复测验证优化效果”. GeoGi-OS D1/D2 explicitly separates execution completion, acceptance, observed result movement, comparability and attribution.

Required wording:
- “按同口径复测，比较前后变化，并评估可比性、限制条件与归因支持。”
- Do not write that one retest proves an optimization action caused the change.
- Do not promise fixed days-to-effect, guaranteed recommendation or guaranteed ranking.

#### P0-5 Formal score language is ahead of authoritative rules

GeoGi-OS `main` explicitly keeps formal comprehensive weights undefined and `overall_score = null` in the current contract baseline. Current website/Research Center contains “GEO 综合评估指标™” and several expressions that can be read as a formal total score.

Required fix:
- Use “诊断维度 / 观察指标 / 平台表现 / 竞品对比 / 风险与机会” for customer-facing explanation.
- Do not present a formal composite score, fixed platform weights or customer grade until a formally approved scoring policy exists.
- MiniProgram lightweight diagnostic displays, if retained, must be clearly separated from formal GeoGi-OS report scoring.

#### P0-6 “推荐池” / internal algorithm claims must be removed

Current homepage contains “是否进入推荐池”. GeoGi can observe answer presence/recommendation but cannot assert internal candidate-pool state without evidence.

Required fix:
- Replace with “品牌是否在目标问题中被提及或推荐”.
- Root-cause copy must discuss observable evidence and supported diagnosis, not claim knowledge of proprietary platform ranking algorithms.

## 3. Product and homepage rewrite

### 3.1 Hero

Keep brand slogan:

> 让品牌在 AI 时代被看见、被理解、被选择。

Recommended explanatory line:

> GeoGi 面向中国市场品牌，通过真实用户问题、多平台 AI 观察、事实与来源核验、竞品诊断、优化执行和同口径复测，帮助企业看清品牌在 AI 回答中的表现，并形成可执行的 GEO 优化路径。

Do not promise outcome. Do not imply automatic platform control.

### 3.2 Customer-facing capability chain

Replace simplified causal claims with the externally understandable chain:

1. 品牌与业务事实梳理
2. 真实用户问题与决策场景设计
3. 国内 AI 平台受控观察
4. 原始回答、引用与事实核验
5. 品牌 / 竞品诊断与机会识别
6. 优化方案与执行验收
7. 同口径复测与变化评估
8. 报告 QA 与交付

This maps to current GeoGi-OS capability without exposing contract object names.

### 3.3 Platform scope

Service scope must state China-market AI platforms.

Current authoritative platform boundary includes:
- 豆包
- 腾讯元宝
- 通义千问
- DeepSeek
- Kimi

However, current formal four/five-platform governance still treats Kimi as `validation_pending` in the mainline Reader governance. Therefore:
- Do not claim a formal five-platform standard is currently complete.
- Website may say “覆盖目标国内主流 AI 平台，具体平台范围按项目与当前验证状态确定”.
- When listing examples, avoid implying every project has identical formally comparable five-platform coverage.

### 3.4 Deliverables

Replace current result panel labels with evidence-safe labels:

- 可见表现：目标问题中品牌是否被提及 / 推荐
- 信息准确：身份、业务、属性、关系与时效信息是否准确
- 竞品对比：同类问题中的品牌差异与竞争表现
- 证据与风险：显性引用、推断来源、事实支持和风险边界
- 优化机会：根因、机会与优先行动
- 复测变化：同口径前后变化、可比性与限制条件

Avoid a formal “总分” until scoring policy is approved.

### 3.5 Service cards

The existing five commercial service names can remain as customer packaging, but descriptions must be implementation-safe:

- AI 可见度诊断
- GEO 全景诊断报告
- GEO 订阅优化服务
- 小微企业 GEO 代运营服务
- 企业定制 GEO 增长服务

Each card must describe observable deliverables, not guaranteed outcome.

### 3.6 Tourism industry correction

The current card says “帮助景区、旅行社、平台和服务商”. The first formal Industry Pack is travel-service oriented.

Primary tourism customers should be expressed as:
- 旅行社
- 高端定制游
- 小团 / 精品团
- 地接服务
- 目的地服务商

Hotels, scenic spots, OTA and transport can appear as related supply/evidence entities rather than the first-pack primary focus.

## 4. Research Center 2.0

### 4.1 Canonical route

Use `/insights/` as the Research Center canonical root.

Legacy `/research/` routes may remain only as explicit redirects for already published URLs. New articles should not be split unpredictably between `/research/` and `/insights/`.

Recommended article route:

`/insights/<slug>/`

### 4.2 Fixed editorial categories

Use five stable top-level categories:

1. GEO 基础研究
2. AI 平台研究
3. GeoGi 方法论
4. 行业研究
5. 年度研究报告

“品牌 AI 可见度”“案例”“引用”“竞品”等作为 topics/tags, not new top-level categories unless a future governance decision changes the taxonomy.

### 4.3 China service boundary vs global research references

Research may use international academic papers and official global platform documentation when relevant to foundational concepts. The site must distinguish:

- 全球公开研究 / 机制参考
- GeoGi 当前中国市场服务平台范围

Do not let Google/ChatGPT research references imply that GeoGi currently sells overseas-platform testing as part of its China-market service.

### 4.4 Structured content source

Stop hand-maintaining whole article HTML files as the primary source.

Target structure:

```text
content/
  research/
    <slug>/
      article.md
      metadata.json
      assets/
```

`metadata.json` minimum fields:

```json
{
  "slug": "",
  "title": "",
  "description": "",
  "published_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD",
  "author": "GeoGi 研究团队",
  "category": "",
  "tags": [],
  "status": "draft|review|approved|published",
  "canonical_path": "",
  "featured": false,
  "sources": [],
  "faq": []
}
```

### 4.5 Build outputs

Research build must generate or update:

- article detail page
- `/insights/index.html`
- category indexes
- homepage latest 3 research cards
- related articles
- `sitemap.xml`
- `feed.xml`
- optional `research-feed.json` for MiniProgram reuse

### 4.6 Research QA

Replace the current one-article validator assumptions with reusable checks:

- required metadata
- canonical route consistency
- published/updated date validity
- allowed category
- source/reference presence when claims require it
- Article structured data consistency
- FAQ structured data equals visible FAQ
- internal-link integrity
- image/alt integrity
- duplicate slug/canonical detection
- no draft content in production build
- forbidden unsupported product claims
- service platform-boundary checks
- homepage latest-3 consistency
- sitemap/feed consistency

CSS should be template-driven, not compared as raw `<style>` blocks between individual articles.

## 5. Content OS → Website publication contract

`GeoGi-Content-OS` remains responsible for content research, platform routing, content review and human approval.

Website publication flow:

`Trend Research → Website Research Draft → Content Review → Human Approval → Website Research Package → Website Build/QA → GitHub PR → Preview/QA → Merge → Gitee release candidate → Human production approval`

No fully automatic unchecked publishing to production.

A Website Research Package should contain:
- canonical article body
- metadata
- source list
- FAQ (if any)
- approved images/visuals
- source Content-OS reference / content ID

## 6. Contact and social architecture

Target structure:

```text
assets/contact/
  wecom-qr.png
  wechat-official-qr.png
  xiaohongshu-qr.png

data/
  contact.json
```

`contact.json` should contain labels and asset paths, but no secrets.

Rules:
- Official QR files only.
- QR should remain readable at common desktop/mobile sizes.
- Do not regenerate official QR through AI.
- Hide missing channels until approved asset is available.
- Contact asset change should not require rewriting the homepage HTML by hand.

## 7. Front-end maintainability

The current pages have accumulated multiple generations of CSS (`v4`, `v5`, `v6`, `v10`, `v17`, `v18`) and duplicate `!important` overrides.

v9 target:

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

Rules:
- Keep current approved visual language.
- Extract reusable tokens/components without redesigning the brand.
- Remove contradictory duplicate layout overrides only after visual regression checks.
- Replace inline Base64 image assets with files.
- Add a real mobile nav rather than hiding desktop nav.

## 8. SEO and AI-readable publishing requirements

Every production page:
- unique `<title>` and description
- canonical URL
- robots
- Open Graph metadata
- valid Article schema for articles
- FAQ schema only when matching visible FAQ exists
- Organization schema with file-based official logo URL
- meaningful heading hierarchy
- crawlable text, not text embedded only in images
- valid internal links
- sitemap inclusion

Research sources must distinguish source facts from GeoGi analysis/framework. Avoid unsupported absolutes such as “唯一”“首个”“保证”“必然”.

## 9. Release workflow

### Development source of truth

GitHub `main` becomes the canonical development branch after v9 PR approval.

Normal flow:

`feature branch → GitHub Draft PR → CI/QA → human review → GitHub main`

### Gitee release

Do not automatically overwrite Gitee `master`.

Target:

`GitHub main → automated sync → Gitee release/github-main → team acceptance → Gitee master → production`

Initial sync automation must be introduced only after current Gitee deployment expectations are confirmed.

Emergency Gitee hotfix rule:
- production hotfix may be made in Gitee only when necessary;
- the exact fix must be backported to GitHub immediately before the next normal release;
- Gitee and GitHub must not become independent long-lived development histories again.

## 10. Implementation commits

Recommended commit order inside PR #1:

### Commit A — governance and audit
- this implementation plan
- update development guidelines to reflect real GitHub/Gitee workflow
- remove obsolete archive-fallback assumptions from sync docs

### Commit B — front-end foundation
- extract CSS/JS
- mobile navigation
- remove Base64 OG/logo/contact payloads where safe
- accessibility baseline

### Commit C — homepage product truth
- rewrite capability chain
- rewrite result/deliverable panel
- retest/attribution-safe wording
- tourism focus correction
- platform-scope disclaimer

### Commit D — Research Center content model
- `content/research/` source model
- metadata schema/taxonomy
- build script
- reusable templates
- legacy redirects

### Commit E — Research publishing QA
- generalized validator
- generated index/latest/category/sitemap/feed
- CI checks

### Commit F — contact/social
- approved WeCom / WeChat Official Account / Xiaohongshu assets
- `contact.json`
- responsive contact presentation

### Commit G — release automation
- GitHub Actions website QA
- controlled Gitee release-candidate sync
- release checklist

### Commit H — launch QA
- desktop/mobile acceptance
- content/SEO/links/schema/assets checks
- production release notes

## 11. Launch acceptance criteria

PR cannot be marked Ready for Review until all P0 items are resolved.

Production release requires:

- no formal score/weight claim beyond current approved GeoGi-OS policy
- no guaranteed ranking/recommendation/effect claim
- China-market service boundary is clear
- platform validation limitations are not hidden
- mobile navigation works
- no broken internal link
- official brand/logo assets only
- official approved contact assets only
- Research Center has one canonical route/taxonomy
- article build and QA are reproducible
- sitemap/feed generated from content source
- desktop and mobile layouts pass visual acceptance
- GitHub source and Gitee release candidate are traceable to the same approved release
- Gitee `master` production update remains human-approved
