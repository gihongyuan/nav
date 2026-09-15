import type { AppConfig, BookmarkCategory, BookmarkLink, SearchEngine, Tool, ToolCategory, ToolVersion } from '@/types/config'

type RawYaml = Record<string, unknown>

/**
 * 将 config/ 下合并后的原始配置规范化为 AppConfig
 *
 * 新格式（扁平、显式 name 字段）：
 *   search:
 *     - { name: Baidu, url: ..., icon: ... }
 *   urls:
 *     - { name: 搜索, icon: ..., children: [ { name: 百度, icon: ..., url: ... }, ... ] }
 *   tools:
 *     - { name: 系统工具, icon: ..., children: [ { name: xxx, icon: ..., desc: ..., versions: [...] }, ... ] }
 */
export function parseConfig(raw: RawYaml): AppConfig {
  return {
    title: String(raw.title ?? '导航'),
    icon: resolveIcon(String(raw.icon ?? '')),
    background: resolveIcon(String(raw.background ?? '')),
    search: parseSearch(raw.search),
    urls: parseUrls(raw.urls),
    tools: parseTools(raw.tools),
  }
}

/**
 * 规范化 yaml 中的图标路径：
 * - 远程 URL（http/https）原样返回
 * - 本地路径 `./icons/x.svg` 或 `/icons/x.svg` → 解析为 BASE_URL 相对路径
 *   这样在子路径部署（如 GitHub Pages 子目录）下也能正确加载
 */
export function resolveIcon(path: string): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const trimmed = path.replace(/^\.?\//, '')
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + trimmed
}

function parseSearch(raw: unknown): SearchEngine[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const o = item as Record<string, unknown>
      if (!o.name) return null
      return {
        name: String(o.name),
        url: String(o.url ?? ''),
        icon: resolveIcon(String(o.icon ?? '')),
      }
    })
    .filter((v): v is SearchEngine => v !== null)
}

function parseUrls(raw: unknown): BookmarkCategory[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const o = item as Record<string, unknown>
      if (!o.name) return null
      return {
        name: String(o.name),
        icon: resolveIcon(String(o.icon ?? '')),
        children: parseChildren(o.children),
      }
    })
    .filter((v): v is BookmarkCategory => v !== null)
}

function parseChildren(raw: unknown): BookmarkLink[] {
  if (!Array.isArray(raw)) return []
  const items = raw.map((item): BookmarkLink | null => {
    if (!item || typeof item !== 'object') return null
    const o = item as Record<string, unknown>
    if (!o.name) return null
    const link: BookmarkLink = {
      title: String(o.name),
      icon: resolveIcon(String(o.icon ?? '')),
      url: String(o.url ?? ''),
    }
    if (o.description) link.description = String(o.description)
    if (o.background != null) link.background = String(o.background)
    return link
  })
  return items.filter((v): v is BookmarkLink => v !== null)
}

// ============ 工具配置解析 ============

function parseTools(raw: unknown): ToolCategory[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const o = item as Record<string, unknown>
      if (!o.name) return null
      return {
        name: String(o.name),
        icon: resolveIcon(String(o.icon ?? '')),
        children: parseToolChildren(o.children),
      }
    })
    .filter((v): v is ToolCategory => v !== null)
}

function parseToolChildren(raw: unknown): Tool[] {
  if (!Array.isArray(raw)) return []
  const items = raw.map((item): Tool | null => {
    if (!item || typeof item !== 'object') return null
    const o = item as Record<string, unknown>
    if (!o.name) return null
    const tool: Tool = {
      name: String(o.name),
      icon: resolveIcon(String(o.icon ?? '')),
      desc: String(o.desc ?? ''),
      versions: parseVersions(o.versions),
    }
    if (o.tags && Array.isArray(o.tags)) {
      tool.tags = o.tags.map(String)
    }
    return tool
  })
  return items.filter((v): v is Tool => v !== null)
}

function parseVersions(raw: unknown): ToolVersion[] {
  if (!Array.isArray(raw)) return []
  const items = raw.map((item): ToolVersion | null => {
    if (!item || typeof item !== 'object') return null
    const o = item as Record<string, unknown>
    if (!o.version) return null
    return {
      version: String(o.version),
      name: String(o.name ?? ''),
      url: String(o.url ?? ''),
      latest: Boolean(o.latest),
    }
  })
  return items.filter((v): v is ToolVersion => v !== null)
}
