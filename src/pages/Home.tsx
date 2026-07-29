import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { CATEGORIES, type Category } from '../types'
import { matchesQuery } from '../lib/courseUtils'
import { CourseCard } from '../components/CourseCard'

export function Home() {
  const { courses } = useStore()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Category | 'ALL'>('ALL')

  const results = useMemo(() => {
    return courses
      .filter((c) => (cat === 'ALL' ? true : c.category === cat))
      .filter((c) => matchesQuery(c, query))
      .sort((a, b) => a.code.localeCompare(b.code))
  }, [courses, query, cat])

  const countByCat = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of courses) m[c.category] = (m[c.category] ?? 0) + 1
    return m
  }, [courses])

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">课程评价</h1>
        <p className="mt-1 text-sm text-slate-600">
          收录 ICOM / ECOM / FITE / COMP 四类课程共 {courses.length} 门，
          评价来自往届学长学姐的公开分享。
        </p>
      </section>

      <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          搜索课程名称或编号
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索课程名称或编号，例如 FITE2000 / data structures"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <CatButton active={cat === 'ALL'} onClick={() => setCat('ALL')}>
          全部 {courses.length}
        </CatButton>
        {CATEGORIES.map((c) => (
          <CatButton key={c} active={cat === c} onClick={() => setCat(c)}>
            {c} {countByCat[c] ?? 0}
          </CatButton>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          没有匹配的课程，换个关键词试试。
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((c) => (
            <CourseCard key={c.code} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}

function CatButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 ${
        active
          ? 'border-sky-600 bg-sky-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  )
}
