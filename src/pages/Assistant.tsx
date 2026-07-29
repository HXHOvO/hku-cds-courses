import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { CATEGORIES, type Category } from '../types'
import { hasAllTags, usedTags } from '../lib/courseUtils'
import { TagFilter } from '../components/TagFilter'
import { StarRating } from '../components/StarRating'
import { CategoryBadge, Tag } from '../components/Tag'

export function Assistant() {
  const { courses, myRatings, setRating, clearRatings } = useStore()
  const [selected, setSelected] = useState<string[]>([])
  const [cat, setCat] = useState<Category | 'ALL'>('ALL')

  const available = useMemo(() => usedTags(courses), [courses])

  const filtered = useMemo(
    () =>
      courses
        .filter((c) => (cat === 'ALL' ? true : c.category === cat))
        .filter((c) => hasAllTags(c, selected))
        .sort((a, b) => a.code.localeCompare(b.code)),
    [courses, selected, cat],
  )

  /** 我打过分的课程，按分数从高到低 */
  const ranked = useMemo(() => {
    return courses
      .filter((c) => (myRatings[c.code] ?? 0) > 0)
      .sort((a, b) => {
        const d = (myRatings[b.code] ?? 0) - (myRatings[a.code] ?? 0)
        return d !== 0 ? d : a.code.localeCompare(b.code)
      })
  }, [courses, myRatings])

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    )

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">选课小助手</h1>
        <p className="mt-1 text-sm text-slate-600">
          先按你在意的条件筛课，再给感兴趣的课打分，右侧会自动排出你自己的优先级。
        </p>
        <p className="mt-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-900">
          你的打分只保存在这台设备的浏览器里，不会上传、不会被其他同学看到，也不参与任何统计。
          换设备或清理浏览器数据后就会消失。
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        {/* 左：筛选 + 结果 */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={cat === 'ALL'} onClick={() => setCat('ALL')}>
              全部
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </FilterChip>
            ))}
          </div>

          <TagFilter
            selected={selected}
            onToggle={toggle}
            onClear={() => setSelected([])}
            available={available}
          />

          <div>
            <h2 className="mb-2 font-semibold text-slate-900">
              符合条件的课程 · {filtered.length} 门
            </h2>

            {filtered.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                没有同时满足这些条件的课程，试着少选几个标签。
              </p>
            ) : (
              <ul className="space-y-2">
                {filtered.map((c) => (
                  <li
                    key={c.code}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={c.category} />
                          <Link
                            to={`/course/${c.code}`}
                            className="font-mono text-sm font-semibold text-sky-700 hover:underline"
                          >
                            {c.code}
                          </Link>
                        </div>
                        <p className="mt-1 font-medium text-slate-900">{c.name}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.tags.map((t) => (
                            <Tag key={t} label={t} />
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="mb-1 text-xs text-slate-500">我的打分</p>
                        <StarRating
                          value={myRatings[c.code] ?? 0}
                          onChange={(v) => setRating(c.code, v)}
                          size="sm"
                          label={`给 ${c.code} 打分`}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 右：我的排序 */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">我的心愿排序</h2>
              {ranked.length > 0 && (
                <button
                  type="button"
                  onClick={clearRatings}
                  className="cursor-pointer text-xs text-slate-500 hover:text-rose-600 hover:underline"
                >
                  清空
                </button>
              )}
            </div>

            {ranked.length === 0 ? (
              <p className="text-sm text-slate-500">
                还没有打分。给左边的课点星星，这里会按分数排好。
              </p>
            ) : (
              <ol className="space-y-2">
                {ranked.map((c, i) => (
                  <li key={c.code} className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/course/${c.code}`}
                        className="block truncate font-mono text-sm font-medium text-sky-700 hover:underline"
                      >
                        {c.code}
                      </Link>
                      <p className="truncate text-xs text-slate-500">{c.name}</p>
                    </div>
                    <StarRating
                      value={myRatings[c.code] ?? 0}
                      readOnly
                      size="sm"
                      label="我的打分"
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function FilterChip({
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
