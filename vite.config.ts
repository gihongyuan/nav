import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, resolve, sep, extname, basename } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import * as yaml from 'js-yaml'

/** 项目根目录 */
const ROOT = fileURLToPath(new URL('.', import.meta.url))
/** config 目录 */
const CONFIG_DIR = join(ROOT, 'config')
/** 书签目录 */
const BOOKMARKS_DIR = join(CONFIG_DIR, 'bookmarks')
/** 图标目录 */
const ICONS_DIR = join(CONFIG_DIR, 'icons')

/**
 * 导航配置 Vite 插件
 *
 * 1. 提供虚拟模块 `virtual:nav-config`：编译期读取 config/ 下所有 YAML 并合并
 * 2. 开发服务器：中间件拦截 /icons/* 请求，从 config/icons/ 提供静态文件
 * 3. 构建时：将 config/icons/ 复制到 dist/icons/
 */
function navConfigPlugin(): Plugin {
  const VIRTUAL_ID = 'virtual:nav-config'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  /** 读取并解析单个 YAML 文件 */
  function loadYaml(filePath: string): Record<string, unknown> {
    const content = readFileSync(filePath, 'utf-8')
    return (yaml.load(content) as Record<string, unknown>) ?? {}
  }

  /** 读取所有书签 YAML 文件，按 categoryOrder 排序后合并 */
  function buildConfig(): Record<string, unknown> {
    // 读取全局配置
    const global = loadYaml(join(CONFIG_DIR, 'global.yaml'))
    const categoryOrder = (global.categoryOrder as string[]) ?? []

    // 读取所有书签文件
    const bookmarkFiles = readdirSync(BOOKMARKS_DIR).filter((f) => f.endsWith('.yaml'))
    const bookmarksMap = new Map<string, unknown>()
    for (const file of bookmarkFiles) {
      const key = basename(file, '.yaml')
      const data = loadYaml(join(BOOKMARKS_DIR, file))
      bookmarksMap.set(key, data)
    }

    // 按 categoryOrder 排序
    const urls: unknown[] = []
    for (const key of categoryOrder) {
      const bookmark = bookmarksMap.get(key)
      if (bookmark) urls.push(bookmark)
    }
    // 追加未在 order 中列出的分类（防御性）
    for (const [key, data] of bookmarksMap) {
      if (!categoryOrder.includes(key)) urls.push(data)
    }

    return {
      title: global.title,
      icon: global.icon,
      background: global.background,
      search: global.search,
      urls,
    }
  }

  /** MIME 类型映射 */
  const MIME: Record<string, string> = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  }

  /** 递归复制目录 */
  function copyDirSync(src: string, dest: string) {
    if (!existsSync(src)) return
    mkdirSync(dest, { recursive: true })
    for (const entry of readdirSync(src)) {
      const srcPath = join(src, entry)
      const destPath = join(dest, entry)
      if (statSync(srcPath).isDirectory()) {
        copyDirSync(srcPath, destPath)
      } else {
        copyFileSync(srcPath, destPath)
      }
    }
  }

  return {
    name: 'nav-config',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return

      // 注册文件监听：修改配置后 Vite 自动重新构建虚拟模块
      this.addWatchFile(join(CONFIG_DIR, 'global.yaml'))
      if (existsSync(BOOKMARKS_DIR)) {
        for (const file of readdirSync(BOOKMARKS_DIR)) {
          if (file.endsWith('.yaml')) {
            this.addWatchFile(join(BOOKMARKS_DIR, file))
          }
        }
      }

      const config = buildConfig()
      return `export default ${JSON.stringify(config)}`
    },

    configureServer(server) {
      // 开发服务器：为 /icons/* 提供静态文件服务
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? ''
        if (rawUrl.startsWith('/icons/')) {
          // 去掉查询参数，再解码 percent-encoded 中文路径
          const pathname = rawUrl.split('?')[0]
          const relativePath = decodeURIComponent(pathname.slice('/icons/'.length))
          const filePath = resolve(ICONS_DIR, relativePath)
          // 安全检查：确保解析后的路径仍在图标目录内（防止 ../ 穿越）
          if (!filePath.startsWith(ICONS_DIR + sep)) {
            next()
            return
          }
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const ext = extname(filePath).toLowerCase()
            res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
            res.end(readFileSync(filePath))
            return
          }
        }
        next()
      })
    },

    closeBundle() {
      // 构建完成后复制图标到 dist/icons/
      const distIcons = join(ROOT, 'dist/icons')
      copyDirSync(ICONS_DIR, distIcons)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), navConfigPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
