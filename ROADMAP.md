# 开发路线图（ROADMAP）

本文件记录导航起始页后续分阶段开发计划。每个阶段以「目标 / 背景 / 涉及文件 / 实现要点 / 验收标准」结构描述，供 Agent 据此推进迭代。完成一项后勾选对应复选框。

> 通用约定：所有改动需通过 `npm run build`（含 `vue-tsc` 类型检查）；视觉语言遵循 Apple HIG（扁平 + 玻璃拟态、低饱和灰白调、克制强调色、统一圆角 8/12/16px）；配置仍由根目录 `settings.yaml` 编译期内联驱动，改 yaml 后需重新构建。

---

## 任务一：页面字体结构协调化

- [x] 完成

**目标**：建立统一的字体设计令牌体系，消除各组件内联硬编码的字号 / 字重 / 行高，使整体排版更协调美观，并让全局调整可在一处生效。

**背景**：当前仅 `src/styles/tokens.css` 定义了 `--font-sans` 字体族；字号（11 / 12 / 13 / 14 / 16 / 22 / 64px）、字重（200 / 500 / 600）、行高散落在 `HeroClock.vue`、`SearchBar.vue`、`BookmarkCard.vue`、`DockItem.vue`、`EngineOption.vue`、`BookmarkGrid.vue` 的 scoped style 中，缺乏令牌抽象，全局微调需逐文件修改。

**涉及文件**：
- `src/styles/tokens.css`、`src/styles/global.css`
- `uno.config.ts`（theme.fontFamily 已注册 `sans`，可补充 size / weight 映射）
- 上述各业务组件

**实现要点**：
- 在 `tokens.css` 新增字号阶梯令牌（如 `--text-xs/sm/base/lg/xl/2xl/display`）、字重令牌（`--font-weight-regular/medium/semibold/light`）、行高令牌（`--leading-tight/normal`）。
- 在 `uno.config.ts` 的 theme 中映射这些令牌，使其可作为 UnoCSS 工具类使用。
- 将各组件内联值替换为令牌引用，统一字号语义（如标题用 `--text-sm` + `--font-weight-medium`）。
- 复核 `HeroClock`（64px / 字重 200）与 `SearchBar`（16px / 字重 600）的字重对比是否仍协调，必要时微调令牌取值。

**验收标准**：
- `npm run build` 通过。
- 视觉上字号层级清晰，组件中无散落的硬编码像素值。
- 令牌可在 `tokens.css` 一处调整、全局生效。

---

## 任务二：搜索引擎下拉框布局修复

- [ ] 完成

**目标**：搜索引擎下拉框（`BaseDropdown` 菜单）改为固定宽度；修复输入框与右侧搜索按钮的视觉重叠。

**背景**：
- `src/components/base/BaseDropdown.vue` 的 `.base-dropdown__menu` 仅设 `min-width: 140px`、`left: 0` 绝对定位，宽度随内容浮动，无固定宽度。
- `src/components/business/SearchBar.vue` 的 `.search-bar__box` 为 flex 布局（trigger + input `flex:1` + button `flex-shrink:0` 36×36），理论上不应重叠；实际重叠疑源于 trigger 区 `padding` / `border-right` 与 input 在窄宽度下的挤压，或下拉菜单展开时绝对定位覆盖 input。需实地复现后定位。

**涉及文件**：
- `src/components/base/BaseDropdown.vue`
- `src/components/business/SearchBar.vue`（必要时 `EngineOption.vue`）

**实现要点**：
- 为 `.base-dropdown__menu` 设固定 `width`（与 trigger 对齐或给定定值），保证不同引擎名长度下菜单宽度恒定。
- 复查 `.search-bar__trigger` 的 `padding` / `border-right` 与 input 间距，确保 trigger 收起态不侵占 input 可视区；窄屏（≤600px）分支一并校验。
- 确认下拉菜单展开时 `z-index` 与定位不遮挡 input 文本输入区。

**验收标准**：
- 切换不同长度引擎名，下拉框宽度恒定。
- 输入框文字与右侧按钮在任何视口宽度下均不重叠。
- `npm run build` 通过。

---

## 任务三：书签卡片背景可配置（settings.yaml）

- [ ] 完成

**目标**：书签卡片背景支持在 `settings.yaml` 配置，默认白色，可配置为任意颜色或透明。

**背景**：`src/components/business/BookmarkCard.vue` 当前默认态无背景（依赖壁纸），hover 态为 `rgba(255,255,255,0.1)`；图标容器有独立玻璃样式。配置类型 `AppConfig`（`src/types/config.ts`）与解析 `parseConfig`（`src/utils/parseConfig.ts`）目前仅含 `title / icon / background / search / urls`，无卡片背景字段。

**涉及文件**：
- `settings.yaml`
- `src/types/config.ts`、`src/utils/parseConfig.ts`
- `src/stores/config.ts`
- `src/components/business/BookmarkCard.vue`

**实现要点**：
- `AppConfig` 新增可选字段 `cardBackground?: string`（语义：颜色值或 `"transparent"`，缺省视为白色 `#ffffff`）。
- `parseConfig` 读取 `raw.cardBackground`，缺省给白色。
- `BookmarkCard.vue` 通过 `useConfigStore().config.cardBackground` 计算卡片背景样式：`transparent` 时透明（保留现有依赖壁纸的观感），其他值作为底色；hover 态逻辑保留或适配。
- `settings.yaml` 增加注释示例（默认白、可改颜色、可透明）。

**验收标准**：
- 不配置时卡片为白色底；配置颜色生效；配置 `transparent` 时透明。
- `npm run build` 通过，类型检查无报错。

---

## 阶段四：「全部」分类按点击次数排序 + 点击次数红点

- [ ] 完成

**目标**：当分类为「全部」时，书签按点击次数降序排列（点击次数存浏览器缓存）；卡片右上角显示点击次数小红点。

**背景**：
- `src/stores/config.ts` 中 `ALL_CATEGORY = '全部'`，`visibleLinks` 在「全部」态返回 `allLinks`（yaml 顺序扁平化），无排序机制。
- `BookmarkCard.vue` 为原生 `<a target="_blank">`，**无 click 处理**；全项目**无任何 localStorage / sessionStorage 使用**，需新建持久层。

**涉及文件**：
- 新增 `src/composables/useClickStats.ts`（或 `src/utils/clickStats.ts`）
- `src/stores/config.ts`（`visibleLinks` 排序）
- `src/components/business/BookmarkCard.vue`（click 拦截 + 红点渲染）

**实现要点**：
- 新建点击统计 composable，基于 `localStorage`（key 如 `nav:click-stats`），提供 `recordClick(url)`、`getClickCount(url)` 及响应式计数。
- `BookmarkCard.vue` 增加 `@click` 处理：先 `recordClick(link.url)` 再放行原生跳转（不 `preventDefault`，避免破坏 `target=_blank` 新标签打开行为；或 `preventDefault` 后 `window.open` 再记录 —— 择一并保持新标签语义）。
- `stores/config.ts` 的 `visibleLinks`：当 `activeCategory === ALL_CATEGORY` 时按 `getClickCount` 降序排序。
- `BookmarkCard.vue` 右上角渲染小红点，显示次数；样式遵循 Apple HIG 克制原则，小尺寸、低饱和红。

**待执行时敲定的细节（建议）**：
- 计数为 0 的书签排序位置：建议「计数 > 0 者在前、计数相等按 yaml 顺序、计数为 0 者居后」。
- 非「全部」态是否显示红点：建议红点始终显示（仅「全部」态参与排序），以保持信息一致。

**验收标准**：
- 点击书签后刷新页面，「全部」分类中该书签排序上升、右上角红点显示次数。
- `npm run build` 通过。
