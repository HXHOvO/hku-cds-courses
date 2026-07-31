import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Course } from '../types'
import { CategoryBadge, Tag } from '../components/Tag'
import { StarRating } from '../components/StarRating'
import { avgRating } from '../lib/courseUtils'

export function Compare() {
  const { courses, compareList, removeFromCompare, clearCompare } = useStore()

  const compareCourses = useMemo(() => {
    const map = new Map(courses.map((c) => [c.code, c]))
    return compareList
      .map((code) => map.get(code))
      .filter((c): c is Course => c !== undefined)
  }, [courses, compareList])

  const cols = compareCourses.length
  const gridCols =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div>
      <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">课程对比</h1>
          <p className="mt-1 text-sm text-slate-600">
            {compareCourses.length === 0
              ? '还没加入任何课程'
              : `已加入 ${compareCourses.length} 门课（最多 3 门）`}
          </p>
        </div>
        {compareCourses.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="cursor-pointer text-xs text-slate-500 hover:text-rose-600 hover:underline"
          >
            清空对比
          </button>
        )}
      </section>

      {compareCourses.length === 0 ? (
        <EmptyState />
      ) : compareCourses.length === 1 ? (
        <PromptToAddMore />
      ) : (
        <div className={`grid gap-4 ${gridCols}`}>
          {compareCourses.map((c) => (
            <CompareCard
              key={c.code}
              course={c}
              onRemove={removeFromCompare}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CompareCard({
  course,
  onRemove,
}: {
  course: Course
  onRemove: (code: string) => void
}) {
  const avg = avgRating(course)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CategoryBadge category={course.category} />
            <span className="font-mono text-sm font-semibold text-slate-900">
              {course.code}
            </span>
          </div>
          <Link to={`/course/${course.code}`} className="mt-1.5 block">
            <h3 className="font-medium text-slate-900 hover:text-sky-700 hover:underline">
              {course.name}
            </h3>
          </Link>
          {course.nameZh && (
            <p className="text-sm text-slate-500">{course.nameZh}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(course.code)}
          aria-label={`从对比中移除 ${course.code}`}
          title="移除"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-2 focus:outline-offset-2 focus:outline-rose-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Row label="评分">
        {avg !== null ? (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avg)} readOnly size="sm" />
            <span className="text-sm text-slate-700">
              {avg.toFixed(1)} · {course.reviews.length} 条评价
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400">暂无评价</span>
        )}
      </Row>

      <Row label="学分">
        <span className="text-sm text-slate-900">{course.credits ?? '—'}</span>
      </Row>

      <Row label="评价标签">
        {course.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {course.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        ) : (
          <span className="text-sm text-slate-400">暂无</span>
        )}
      </Row>

      <Row label="简介">
        <p className="text-sm text-slate-700">{course.summary ?? '暂无'}</p>
      </Row>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-sm text-slate-500">
        去首页或选课小助手页面，点课程卡右上角的 ⊕ 加入对比
      </p>
      <p className="mt-2 text-xs text-slate-400">最多 3 门课程</p>
      <Link
        to="/"
        className="mt-3 inline-block text-sm font-medium text-sky-600 hover:underline"
      >
        去首页浏览 →
      </Link>
    </div>
  )
}

function PromptToAddMore() {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-6 text-center">
      <p className="text-sm text-sky-900">
        已加入 1 门课程，再加 1–2 门开始对比
      </p>
      <Link
        to="/"
        className="mt-3 inline-block text-sm font-medium text-sky-700 hover:underline"
      >
        去首页添加 →
      </Link>
    </div>
  )
}
