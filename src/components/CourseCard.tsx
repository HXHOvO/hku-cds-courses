import { Link } from 'react-router-dom'
import type { Course } from '../types'
import { CategoryBadge, Tag } from './Tag'
import { avgRating } from '../lib/courseUtils'
import { StarRating } from './StarRating'

export function CourseCard({ course }: { course: Course }) {
  const avg = avgRating(course)

  return (
    <Link
      to={`/course/${course.code}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-sky-500"
    >
      <div className="flex items-start justify-between gap-3">
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
        <div className="shrink-0 text-right">
          {avg !== null ? (
            <>
              <StarRating value={Math.round(avg)} readOnly size="sm" label="学长姐平均分" />
              <p className="text-xs text-slate-500">
                {avg.toFixed(1)} · {course.reviews.length} 条评价
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400">
              {course.reviews.length} 条评价
            </p>
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
    </Link>
  )
}
