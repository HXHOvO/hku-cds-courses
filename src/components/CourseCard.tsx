import { Link } from 'react-router-dom'
import type { Course } from '../types'
import { CategoryBadge, Tag } from './Tag'
import { avgRating } from '../lib/courseUtils'
import { StarRating } from './StarRating'
import { useStore } from '../lib/store'

const COMPARE_MAX = 3

export function CourseCard({ course }: { course: Course }) {
  const avg = avgRating(course)
  const {
    isFavorite,
    toggleFavorite,
    isInCompare,
    toggleCompare,
    compareList,
  } = useStore()
  const favorited = isFavorite(course.code)
  const inCompare = isInCompare(course.code)
  const compareFull = !inCompare && compareList.length >= COMPARE_MAX

  return (
    <div className="relative">
      <Link
        to={`/course/${course.code}`}
        className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-sky-500"
      >
        <div className="flex items-start justify-between gap-3 pr-12">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CategoryBadge category={course.category} />
              <span className="font-mono text-sm font-semibold text-slate-900">
                {course.code}
              </span>
            </div>
            <h3 className="mt-1.5 truncate font-medium text-slate-900">{course.name}</h3>
            {course.nameZh && (
              <p className="truncate text-sm text-slate-500">{course.nameZh}</p>
            )}
          </div>
        </div>

        {course.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {course.tags.slice(0, 6).map((t) => (
              <Tag key={t} label={t} />
            ))}
            {course.tags.length > 6 && (
              <span className="text-xs text-slate-400">+{course.tags.length - 6}</span>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-end text-xs">
          {avg !== null ? (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avg)} readOnly size="sm" label="学长姐平均分" />
              <span className="text-slate-500">
                {avg.toFixed(1)} · {course.reviews.length} 条评价
              </span>
            </div>
          ) : (
            <span className="text-slate-400">{course.reviews.length} 条评价</span>
          )}
        </div>
      </Link>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => toggleFavorite(course.code)}
          aria-label={favorited ? '取消收藏' : '收藏'}
          aria-pressed={favorited}
          title={favorited ? '取消收藏' : '收藏'}
          className={`grid h-8 w-8 place-items-center rounded-full transition focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 ${
            favorited
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
              : 'bg-slate-100/80 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(course.code)}
          aria-label={inCompare ? '从对比中移除' : '加入对比'}
          aria-pressed={inCompare}
          title={inCompare ? '从对比中移除' : compareFull ? '对比最多 3 门课' : '加入对比'}
          disabled={compareFull}
          className={`grid h-8 w-8 place-items-center rounded-full transition focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 disabled:cursor-not-allowed ${
            inCompare
              ? 'bg-sky-100 text-sky-600 hover:bg-sky-200'
              : compareFull
                ? 'bg-slate-100/60 text-slate-300'
                : 'bg-slate-100/80 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inCompare ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M5 8h14" />
            <path d="M12 3v18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
