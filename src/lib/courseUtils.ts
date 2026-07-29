import type { Course } from '../types'

/** 学长姐评价的平均分，没有人给分则返回 null */
export function avgRating(course: Course): number | null {
  const scores = course.reviews
    .map((r) => r.rating)
    .filter((r): r is number => typeof r === 'number' && r > 0)
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

/** 搜索：匹配课程编号、英文名、中文名，忽略大小写与空格 */
export function matchesQuery(course: Course, query: string): boolean {
  const q = query.trim().toLowerCase().replace(/\s+/g, '')
  if (!q) return true
  const haystack = [course.code, course.name, course.nameZh ?? '']
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, '')
  return haystack.includes(q)
}

/** 课程是否包含全部所选标签 */
export function hasAllTags(course: Course, selected: string[]): boolean {
  return selected.every((t) => course.tags.includes(t))
}

/** 收集当前课程库里真实用到的标签 */
export function usedTags(courses: Course[]): Set<string> {
  const set = new Set<string>()
  for (const c of courses) for (const t of c.tags) set.add(t)
  return set
}
