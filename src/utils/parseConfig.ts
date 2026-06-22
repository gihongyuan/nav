import type { AppConfig, BookmarkCategory, BookmarkLink, SearchEngine } from '@/types/config'

type RawYaml = Record<string, unknown>

/**
 * 将 settings.yaml 的原始结构规范化为 AppConfig
 *
 * yaml 结构简化示例：
 *   search:
 *     - Baidu: { name, url, icon }
 *     - Google: { name, url, icon }
 *   urls:
 *     - 搜索引擎: { icon, children: [ { 百度: { icon, url, description } }, ... ] }
 *     - 邮箱:     { icon, children: [ { 163邮箱: { icon, url, description } }, ... ] }
 */
export function parseConfig(raw: RawYaml): AppConfig {
  return {
    title: String(raw.title ?? '导航'),
    icon: resolveIcon(String(raw.icon ?? '')),
    background: resolveIcon(String(raw.background ?? '')),
    search: parseSearch(raw.search),
    urls: parseUrls(raw.urls),
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
      const inner = unwrapSingle(item)
      if (!inner) return null
      const [key, o] = inner
      return {
        name: String(o.name ?? key),
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
      const inner = unwrapSingle(item)
      if (!inner) return null
      const [key, o] = inner
      return {
        name: key,
        icon: resolveIcon(String(o.icon ?? '')),
        children: parseChildren(o.children),
      }
    })
    .filter((v): v is BookmarkCategory => v !== null)
}

function parseChildren(raw: unknown): BookmarkLink[] {
  if (!Array.isArray(raw)) return []
  const items = raw.map((item): BookmarkLink | null => {
    const inner = unwrapSingle(item)
    if (!inner) return null
    const [key, o] = inner
    const link: BookmarkLink = {
      title: key,
      icon: resolveIcon(String(o.icon ?? '')),
      url: String(o.url ?? ''),
    }
    if (o.description) link.description = String(o.description)
    if (o.background != null) link.background = String(o.background)
    return link
  })
  return items.filter((v): v is BookmarkLink => v !== null)
}

/**
 * yaml 的「数组里嵌套单 key 对象」结构（如 `- 百度: { ... }`）解包为 [key, value]
 */
function unwrapSingle(item: unknown): [string, Record<string, unknown>] | null {
  if (!item || typeof item !== 'object') return null
  const keys = Object.keys(item)
  if (keys.length === 0) return null
  const key = keys[0]
  const inner = (item as Record<string, unknown>)[key]
  if (!inner || typeof inner !== 'object') return null
  return [key, inner as Record<string, unknown>]
}
