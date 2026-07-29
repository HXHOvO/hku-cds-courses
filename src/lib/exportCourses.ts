import type { Course } from '../types'

/** 把课程数组序列化成可直接覆盖 src/data/courses.ts 的源码 */
export function toCoursesSource(courses: Course[]): string {
  const body = JSON.stringify(courses, null, 2)
  return `import type { Course } from '../types'

/** 由管理后台导出于 ${new Date().toLocaleString('zh-CN')} */
export const SEED_COURSES: Course[] = ${body}
`
}

/** 触发浏览器下载 */
export function download(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
