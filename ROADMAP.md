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

- [x] 完成

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

- [x] 完成

**目标**：书签图标磁贴背景支持在 `settings.yaml` 的每条书签项内独立配置，默认白色磁贴，可配置为任意颜色，或 `transparent`（仅显示图标本身、无任何容器装饰）。

**背景**：`src/components/business/BookmarkCard.vue` 原默认态无外层背景（依赖壁纸），图标容器固定为白色半透明玻璃；用户希望以「内层小磁贴」承载可配置背景，外层不再有可见矩形。配置类型 `AppConfig`（`src/types/config.ts`）与解析 `parseConfig`（`src/utils/parseConfig.ts`）原仅含 `title / icon / background / search / urls`，无书签项背景字段。

**涉及文件**：
- `settings.yaml`
- `src/types/config.ts`、`src/utils/parseConfig.ts`
- `src/components/business/BookmarkCard.vue`

**实现要点**：
- `BookmarkLink` 新增可选字段 `background?: string`（语义：颜色值或 `"transparent"`，缺省白色 `#ffffff`）。注意与顶层 `background`（壁纸）同名不同层级、互不冲突。
- `parseConfig` / `parseChildren` 读取 `o.background` 透传到 `BookmarkLink`。
- `BookmarkCard.vue`：
  - 外层 `.bookmark-card` 去除所有可见背景与 box-shadow，仅承载布局/文字。
  - 内层图标容器（`.bookmark-card__icon`，64×64、圆角 16px）作为「磁贴」承载 `link.background`。
  - `transparent` 态：容器背景 + 阴影全部去除，仅显示 `BaseIcon`；非透明态：以配置色作底、保留默认阴影。
- `settings.yaml` 增加注释与示例（每条书签项 `background: transparent` / `background: "#xxx"`）。

**验收标准**：
- 书签项未配置 `background` 时图标为白色磁贴；配置颜色生效；配置 `transparent` 时只显示图标本身、无任何容器装饰。
- `npm run build` 通过，类型检查无报错。

---

## 任务四：「全部」分类按点击次数排序 + 点击次数红点

- [x] 完成

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

---

## 任务五：搜索输入即时过滤书签 + Dock「全部」改为「常用」Top12

- [x] 完成

**目标**：
1. 输入框聚焦时，dock 与卡片区一同隐藏；在输入框中输入文字，**原卡片区**就地切换为「按名称匹配的全部书签」过滤视图，点击结果项可直接跳转该书签。
2. Dock 首项由「全部」改为「常用」，仅展示按点击次数倒序排列的前 12 个书签（「全部」分类被替换，不再保留入口）。

**背景**：
- `src/components/business/SearchBar.vue` 的 `query` 原本仅在 `handleSearch`（表单提交）时消费，输入过程中无任何过滤反馈；本阶段将 `query` 提升到全局共享，供 `HomeView` 切换卡片区使用，**不**新增独立浮层。
- `src/composables/useSearchFocus.ts` 原只承载 `focused`（驱动壁纸模糊）；本阶段扩展为同时承载 `query`、`trimmedQuery`、`searching = focused && trimmedQuery !== ''` 与 `reset()`，作为跨组件协作的单点状态源。
- `src/stores/config.ts` 中 `ALL_CATEGORY = '全部'` 被 `categories`（首位硬编码注入「全部」项）、`visibleLinks`、默认选中态 `activeCategory` 共用；本阶段新增 `FREQUENT_CATEGORY = '常用'` 与 `FREQUENT_LIMIT = 12`，常量 `ALL_CATEGORY` 保留供外部引用但 dock 不再注入入口。
- `src/components/business/CategoryDock.vue` 直接遍历 `configStore.categories` 渲染，无需改动即可跟随。
- 点击次数来源依赖**阶段四**新建的 `src/composables/useClickStats.ts`（`getClickCount`）；本阶段需在阶段四落地后实施。

**涉及文件**：
- `src/composables/useSearchFocus.ts`（扩展为全局 `query`/`searching`/`reset` 状态源）
- `src/components/business/SearchBar.vue`（`v-model` 绑定全局 `query`、提交/失焦后 `reset` 收尾）
- `src/views/HomeView.vue`（按 `focused`/`searching` 三态切换卡片区；聚焦时 `v-show` 收起 dock）
- `src/components/business/BookmarkGrid.vue`（新增 `emptyHint` prop 承接过滤空态文案）
- `src/stores/config.ts`（`FREQUENT_CATEGORY` + `FREQUENT_LIMIT` 常量、`categories` 首项改为「常用」、`visibleLinks` 在「常用」态返回 Top12、默认选中态切换、`allLinks` 暴露给 HomeView 用于过滤）
- `src/stores/index.ts`（导出 `FREQUENT_CATEGORY`）
- 依赖阶段四：`src/composables/useClickStats.ts`

**实现要点**：
- **搜索即时过滤（就地替换卡片区，不弹浮层）**：
  - `useSearchFocus` 升级为「全局 query + focused」单点：暴露 `focused`、`query`、`trimmedQuery`、`searching`、`reset()`。
  - `SearchBar` 的 `v-model` 绑定全局 `query`；`@focus` → `setFocused(true)`；`@blur` 走 `onBlur`，延迟 200ms 调用 `reset()`（避免点击下方过滤后卡片时 mousedown→blur→DOM 重渲染让 click 丢失目标）；`handleSearch` 跳转后同样 `reset()` + 显式 `blur` 输入框。
  - `HomeView` 卡片区三态：
    - `!focused` → 显示当前分类的 `visibleLinks`；
    - `focused && !searching`（聚焦但输入为空） → 整个 grid 隐藏，让用户专注输入；
    - `searching` → 在原卡片区域显示 `allLinks` 按 title 大小写不敏感包含过滤的全集，不设上限（由 `home__content` 原生滚动承接）。
    - 空匹配时通过 `BookmarkGrid` 的 `emptyHint` prop 显示「没有匹配「query」的书签」。
  - 聚焦时 `CategoryDock` 通过 `v-show="!focused"` 整体隐藏。
- **Dock「常用」Top12**：
  - 新增 `export const FREQUENT_CATEGORY = '常用'`、模块内 `FREQUENT_LIMIT = 12`；常量 `ALL_CATEGORY` 保留但不注入 dock。
  - `sortedAllLinks` computed 集中承载「按 `getClickCount` 降序、稳定保留 yaml 原序」的排序逻辑；`frequentLinks = sortedAllLinks.slice(0, FREQUENT_LIMIT)`。
  - `categories` computed 首项由「全部」改为「常用」，`children` 为 `frequentLinks`。
  - `visibleLinks`：当 `activeCategory === FREQUENT_CATEGORY` 时返回 `frequentLinks`；`ALL_CATEGORY` 态（保留可达入口）返回 `sortedAllLinks`。
  - 默认选中态 `activeCategory` 初始值由 `ALL_CATEGORY` 改为 `FREQUENT_CATEGORY`。

**待执行时敲定的细节（建议 / 已落地）**：
- 输入聚焦但 query 为空：卡片区**完全隐藏**（而非显示原分类），以避免与「聚焦准备搜索」的语义冲突。
- 过滤结果无上限：既然占据整个卡片区，由原生滚动承接超长情况。
- 失焦时序：用 `setTimeout(200ms)` 延迟 `reset()`，覆盖点击下方卡片的 mousedown→blur→click 序列。
- 点击次数为 0 时「常用」列表的填充策略：稳定排序保留 yaml 原序，自然按 yaml 顺序补足至 12 条，避免空 dock。

**验收标准**：
- 点击搜索框 → 卡片区与 dock 一起消失；输入文字 → 卡片区原位显示按名称匹配的全集书签，可直接点击跳转。
- Dock 首项显示「常用」，内容为点击次数倒序前 12；点击书签后刷新，「常用」排序与成员随之更新。
- `npm run build` 通过，类型检查无报错。
