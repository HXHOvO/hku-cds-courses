import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { CategoryBadge, Tag } from '../components/Tag'
import { StarRating } from '../components/StarRating'
import { avgRating } from '../lib/courseUtils'

export function CourseDetail() {
  const { code } = useParams<{ code: string }>()
  const { courses, myRatings, setRating } = useStore()
  const course = courses.find((c) => c.code === code)

  if (!course) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">没有找到课程 {code}。</p>
        <Link to="/" className="mt-3 inline-block text-sm text-sky-600 hover:underline">
          ← 回到课程列表
        </Link>
      </div>
    )
  }

  const avg = avgRating(course)
  const mine = myRatings[course.code] ?? 0

  return (
    <article>
      <Link to="/" className="text-sm text-sky-600 hover:underline">
        ← 课程列表
      </Link>

      <header className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <CategoryBadge category={course.category} />
          <span className="font-mono font-semibold text-slate-900">{course.code}</span>
          {course.credits && (
            <span className="text-sm text-slate-500">{course.credits} 学分</span>
          )}
        </div>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{course.name}</h1>
        {course.nameZh && <p className="text-slate-500">{course.nameZh}</p>}

        {course.summary && (
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {course.summary}
          </p>
        )}

        {course.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">学长姐平均分</p>
            {avg !== null ? (
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(avg)} readOnly size="sm" label="学长姐平均分" />
                <span className="text-sm font-medium text-slate-700">{avg.toFixed(1)}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400">暂无</p>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500">我的打分（只存在你的浏览器里）</p>
            <StarRating
              value={mine}
              onChange={(v) => setRating(course.code, v)}
              size="sm"
              label="我的打分"
            />
          </div>
        </div>
      </header>

      <section className="mt-5">
        <h2 className="mb-3 font-semibold text-slate-900">
          学长学姐评价 · {course.reviews.length} 条
        </h2>

        {course.reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            这门课还没有收集到评价。
          </p>
        ) : (
          <ul className="space-y-3">
            {course.reviews.map((r) => (
              <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-slate-900">{r.author}</span>
                  <span className="text-xs text-slate-500">{r.semester}</span>
                  {typeof r.rating === 'number' && r.rating > 0 && (
                    <StarRating value={r.rating} readOnly size="sm" label="该同学评分" />
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {r.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
