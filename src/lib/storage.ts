import type { Course } from '../types'
import { SEED_COURSES } from '../data/courses'

/**
 * 存储说明
 * ---------
 * 本站没有后端，所有东西都在浏览器 localStorage 里，分成两块互不相干的数据：
 *
 * 1. COURSES_KEY —— 管理员在本机编辑的课程数据。
 *    只影响这台电脑这个浏览器，不会同步给任何访客。
 *    要让全站访客看到新内容，必须「导出 courses.ts」并覆盖 src/data/courses.ts 后重新部署。
 *
 * 2. RATINGS_KEY —— 访客自己的打分。
 *    每个人只存在自己浏览器里，彼此看不见、不上传、不统计。清缓存即消失。
 */

const COURSES_KEY = 'ecic.courses.draft.v1'
const RATINGS_KEY = 'ecic.myRatings.v1'

/* ------------------------------ 课程数据 ------------------------------ */

export function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY)
    if (!raw) return SEED_COURSES
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return SEED_COURSES
    return parsed as Course[]
  } catch {
    return SEED_COURSES
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
  } catch {
    // 存储写满或被禁用时静默失败，页面仍可正常浏览
  }
}

/** 丢弃本机草稿，回到文件里的正式数据 */
export function resetCourses(): void {
  localStorage.removeItem(COURSES_KEY)
}

/** 本机是否存在未导出的草稿 */
export function hasDraft(): boolean {
  return localStorage.getItem(COURSES_KEY) !== null
}

/* ------------------------------ 个人打分 ------------------------------ */

export type MyRatings = Record<string, number>

export function loadMyRatings(): MyRatings {
  try {
    const raw = localStorage.getItem(RATINGS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as MyRatings
  } catch {
    return {}
  }
}

export function saveMyRatings(ratings: MyRatings): void {
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
  } catch {
    /* 忽略 */
  }
}

export function clearMyRatings(): void {
  localStorage.removeItem(RATINGS_KEY)
}
