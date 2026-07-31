import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Course } from '../types'
import { CourseCard } from '../components/CourseCard'

export function Favorites() {
  const { courses, favorites, clearFavorites } = useStore()

  const favoriteCourses = useMemo(() => {
    const map = new Map(courses.map((c) => [c.code, c]))
    return favorites
      .map((code) => map.get(code))
      .filter((c): c is Course => c !== undefined)
      .sort((a, b) => a.code.localeCompare(b.code))
  }, [courses, favorites])

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的收藏</h1>
        <p className="mt-1 text-sm text-slate-600">
          {favorites.length === 0
            ? '还没收藏任何课程'
            : `共 ${favorites.length} 门课，只存在你这台设备的浏览器里`}
        </p>
      </section>

      {favorites.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={clearFavorites}
            className="cursor-pointer text-xs text-slate-500 hover:text-rose-600 hover:underline"
          >
            清空全部
          </button>
        </div>
      )}

      {favoriteCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            去首页点课程卡右上角的书签 ☆ 收藏感兴趣的课
          </p>
          <Link
            to="/"
            className="mt-3 inline-block text-sm font-medium text-sky-600 hover:underline"
          >
            去首页浏览 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {favoriteCourses.map((c) => (
            <CourseCard key={c.code} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}
