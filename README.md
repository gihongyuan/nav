# 导航起始页（nav-startup）

基于 **Vite 8 + Vue 3 + TypeScript + Pinia + UnoCSS** 构建的浏览器起始页，由项目根目录的 `settings.yaml` 统一驱动壁纸、搜索引擎、书签与分类。

> 视觉语言遵循 Apple HIG：扁平 + 玻璃拟态、低饱和灰白调、克制使用强调色、统一圆角 8 / 12 / 16 px。

---

## 快速开始

```bash
npm install
npm run dev        # 开发模式（默认 --host 0.0.0.0，局域网可访问）
npm run build      # vue-tsc 类型检查 + vite 生产构建（输出到 dist/）
npm run preview    # 预览生产产物
npm run lint       # ESLint flat config 自动修复（.ts / .vue）
npm run format     # Prettier 格式化 src/**/*.{ts,vue,css}
npm run test       # Vitest 单元测试
```

---

## 自定义配置（核心）

所有内容均通过项目根目录的 **`settings.yaml`** 配置。结构为「数组里嵌套单 key 对象」，键名即显示名：

```yaml
title: 导航                    # 驱动浏览器标签页标题
icon: /icons/navigation.svg    # 驱动标签页 favicon
background: /background.jpeg   # 壁纸，留空则不设背景

search:                        # 搜索引擎列表
  - Baidu:
      name: Baidu
      url: https://www.baidu.com/s?wd={query}
      icon: /icons/baidu.svg

urls:                          # 书签列表
  - 搜索引擎:
      icon: /icons/search.svg
      children:
        - 百度:
            icon: /icons/baidu.svg
            url: https://www.baidu.com/
            description: 百度搜索
```

**关键规则：**

- `settings.yaml` 由 `@rollup/plugin-yaml` 在**编译期内联**到产物 —— 修改后必须重新 `npm run build` 才生效。
- `title` / `icon` 会在 `main.ts` 启动时写入浏览器标签页（动态设置 `document.title` 与 favicon）。
- 图标支持本地路径（`/icons/foo.svg`，放在 `public/icons/` 下）或远程 URL；本地路径会被解析为 `BASE_URL` 相对路径，便于子路径部署（如 GitHub Pages 子目录）。
- 搜索引擎 URL 中的 `{query}` 占位符会被替换为 `encodeURIComponent(关键词)`。
- 书签卡片点击恒在新标签页打开（`target="_blank" rel="noopener noreferrer"`）。
- Dock 自动在 yaml 的 `urls` 前注入「全部」分类（见 `stores/config.ts` 中的 `ALL_CATEGORY`）。

---

## 项目结构

```
homepage/
├── public/
│   ├── background.jpeg          # 默认壁纸（被 yaml background 引用）
│   ├── favicon.svg
│   ├── icons.svg                # 雪碧图
│   └── icons/                   # 用户提供的 SVG 图标（被 yaml 引用）
├── settings.yaml                # 应用配置 — 全局唯一数据源
├── index.html                   # SPA 入口
├── prototype.html               # 设计原型
├── src/
│   ├── assets/                  # 静态资源（hero.png / vite.svg / vue.svg）
│   ├── components/
│   │   ├── base/                # 通用基础组件 + index.ts 桶导出
│   │   │   ├── BaseGlassPanel.vue
│   │   │   ├── BaseIcon.vue
│   │   │   └── BaseDropdown.vue
│   │   └── business/            # 业务组件 + index.ts 桶导出
│   │       ├── HeroClock.vue
│   │       ├── SearchBar.vue
│   │       ├── EngineOption.vue
│   │       ├── BookmarkGrid.vue
│   │       ├── BookmarkCard.vue
│   │       ├── CategoryDock.vue
│   │       └── DockItem.vue
│   ├── composables/             # useClock / useSearchFocus + index.ts
│   ├── layouts/DefaultLayout.vue
│   ├── views/HomeView.vue
│   ├── router/                  # vue-router (hash 模式，单路由 + 404 redirect)
│   ├── stores/config.ts         # Pinia store（含「全部」分类注入）
│   ├── styles/
│   │   ├── tokens.css           # 设计令牌
│   │   └── global.css
│   ├── types/config.ts          # AppConfig / SearchEngine / BookmarkCategory ...
│   ├── utils/parseConfig.ts     # yaml 嵌套 → 扁平 AppConfig + resolveIcon
│   ├── env.d.ts
│   ├── App.vue
│   └── main.ts                  # 挂载 Pinia/Router，写入 title + favicon
├── uno.config.ts                # presetUno/Icons/Attributify + 令牌映射 + shortcuts
├── vite.config.ts               # vue / unocss / yaml / @ alias
├── eslint.config.js             # ESLint flat config
└── .prettierrc.cjs / tsconfig.*
```

---

## 配置数据流

```
settings.yaml
   │  (@rollup/plugin-yaml 编译期内联为 JS 对象)
   ▼
stores/config.ts  ──►  utils/parseConfig.ts  ──►  AppConfig (types/config.ts)
   │   (注入「全部」分类、memo visibleLinks/searchEngines)
   ▼
components/business/*  ──►  渲染 SearchBar / CategoryDock / BookmarkGrid / HeroClock
```

`parseConfig` 将 yaml「数组嵌套单 key 对象」结构解包为扁平的 `AppConfig`，并通过 `resolveIcon` 统一处理本地/远程图标路径。

---
