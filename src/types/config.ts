/**
 * 解析后的扁平配置类型，来源于 settings.yaml
 */
export interface SearchEngine {
  name: string
  url: string
  icon: string
}

export interface BookmarkLink {
  title: string
  icon: string
  url: string
  description?: string
  /** 单条书签的图标背景：颜色值或 `"transparent"`；缺省白色 */
  background?: string
}

export interface BookmarkCategory {
  name: string
  icon: string
  children: BookmarkLink[]
}

export interface AppConfig {
  title: string
  icon: string
  background: string
  search: SearchEngine[]
  urls: BookmarkCategory[]
}
