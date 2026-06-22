import { ref } from 'vue'
import { useIntervalFn, useDocumentVisibility, watchImmediate } from '@vueuse/core'

/**
 * 时钟钩子 —— 显示格式只到分钟，所以每分钟唤醒一次即可：
 * - 首次 tick 同步执行，避免首屏空白闪烁
 * - 后台标签页（visibility hidden）暂停，恢复时立刻补一次
 * - 内部对齐到下一个分钟边界，避免漂移到 :59
 */
export function useClock() {
  const time = ref(format(new Date(), 'time'))
  const date = ref(format(new Date(), 'date'))

  function tick() {
    const now = new Date()
    time.value = format(now, 'time')
    date.value = format(now, 'date')
  }

  // 一分钟一次，足够覆盖 hour:minute 的显示精度
  const { resume, pause } = useIntervalFn(tick, 60_000, { immediate: false })

  const visibility = useDocumentVisibility()
  watchImmediate(visibility, (v) => {
    if (v === 'visible') {
      tick()
      resume()
    } else {
      pause()
    }
  })

  return { time, date }
}

/** 缓存格式化器：toLocaleTimeString/DateString 每次都会重建 Intl 实例 */
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const dateFmt = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

function format(d: Date, kind: 'time' | 'date'): string {
  return kind === 'time' ? timeFmt.format(d) : dateFmt.format(d)
}
