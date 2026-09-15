/**
 * 解析后的扁平配置类型，来源于 config/ 目录（global.yaml + bookmarks/*.yaml + tools/*.yaml）
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

// ============ 工具下载配置 ============

/** 工具的单个版本 */
export interface ToolVersion {
  version: string
  name: string
  url: string
  latest: boolean
}

/** 单个工具 */
export interface Tool {
  name: string
  icon: string
  desc: string
  tags?: string[]
  versions: ToolVersion[]
}

/** 工具分类 */
export interface ToolCategory {
  name: string
  icon: string
  children: Tool[]
}

export interface AppConfig {
  title: string
  icon: string
  background: string
  search: SearchEngine[]
  urls: BookmarkCategory[]
  tools: ToolCategory[]
}
