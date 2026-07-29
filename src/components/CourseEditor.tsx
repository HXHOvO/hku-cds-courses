import { useState } from 'react'
import type { Course, Review } from '../types'
import { CATEGORIES, type Category } from '../types'
import { TAG_GROUPS, tagColor, tagsByGroup } from '../data/tags'
import { StarRating } from './StarRating'

interface Props {
  course: Course
  /** 已存在的课程编号，用于查重（不含当前课程自己） */
  takenCodes: string[]
  onSave: (course: Course) => void
  onCancel: () => void
  onDelete?: () => void
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500'
const labelCls = 'mb-1 block text-xs font-semibold text-slate-600'

export function CourseEditor({ course, takenCodes, onSave, onCancel, onDelete }: Props) {
  const [draft, setDraft] = useState<Course>(course)
  const [error, setError] = useState('')

  const patch = (p: Partial<Course>) => setDraft((d) => ({ ...d, ...p }))

  const toggleTag = (label: string) =>
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(label)
        ? d.tags.filter((t) => t !== label)
        : [...d.tags, label],
    }))

  const patchReview = (id: string, p: Partial<Review>) =>
    setDraft((d) => ({
      ...d,
      reviews: d.reviews.map((r) => (r.id === id ? { ...r, ...p } : r)),
    }))

  const addReview = () =>
    setDraft((d) => ({
      ...d,
      reviews: [
        ...d.reviews,
        {
          id: `r${Date.now()}`,
          author: '',
          semester: '',
          content: '',
          rating: 0,
        },
      ],
    }))

  const removeReview = (id: string) =>
    setDraft((d) => ({ ...d, reviews: d.reviews.filter((r) => r.id !== id) }))

  const submit = () => {
    const code = draft.code.trim().toUpperCase()
    if (!code) return setError('课程编号不能为空')
    if (!draft.name.trim()) return setError('课程名称不能为空')
    if (takenCodes.includes(code)) return setError(`课程编号 ${code} 已存在`)
    setError('')
    onSave({
      ...draft,
      code,
      name: draft.name.trim(),
      nameZh: draft.nameZh?.trim() || undefined,
      summary: draft.summary?.trim() || undefined,
      reviews: draft.reviews
        .filter((r) => r.content.trim())
        .map((r) => ({
          ...r,
          author: r.author.trim() || '匿名同学',
          semester: r.semester.trim(),
          content: r.content.trim(),
          rating: r.rating && r.rating > 0 ? r.rating : undefined,
        })),
    })
  }

  return (
    <div className="rounded-xl border-2 border-sky-500 bg-white p-5">
      <h3 className="mb-4 font-semibold text-slate-900">编辑课程</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ed-code">
            课程编号 *
          </label>
          <input
            id="ed-code"
            className={inputCls}
            value={draft.code}
            onChange={(e) => patch({ code: e.target.value })}
            placeholder="FITE2000"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="ed-cat">
            类别 *
          </label>
          <select
            id="ed-cat"
            className={inputCls}
            value={draft.category}
            onChange={(e) => patch({ category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="ed-name">
            英文名 *
          </label>
          <input
            id="ed-name"
            className={inputCls}
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="ed-namezh">
            中文名
          </label>
          <input
            id="ed-namezh"
            className={inputCls}
            value={draft.nameZh ?? ''}
            onChange={(e) => patch({ nameZh: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="ed-credits">
            学分
          </label>
          <input
            id="ed-credits"
            type="number"
            min={0}
            className={inputCls}
            value={draft.credits ?? ''}
            onChange={(e) =>
              patch({ credits: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <div className="mt-3">
        <label className={labelCls} htmlFor="ed-summary">
          一句话简介
        </label>
        <textarea
          id="ed-summary"
          rows={2}
          className={inputCls}
          value={draft.summary ?? ''}
          onChange={(e) => patch({ summary: e.target.value })}
        />
      </div>

      {/* 标签 */}
      <div className="mt-4">
        <p className={labelCls}>标签</p>
        <div className="space-y-2 rounded-lg bg-slate-50 p-3">
          {TAG_GROUPS.map((group) => (
            <fieldset key={group}>
              <legend className="mb-1 text-xs text-slate-500">{group}</legend>
              <div className="flex flex-wrap gap-1.5">
                {tagsByGroup(group).map((t) => {
                  const on = draft.tags.includes(t.label)
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => toggleTag(t.label)}
                      aria-pressed={on}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 ${
                        on ? 'bg-slate-900 text-white' : `${tagColor(t.label)} opacity-60`
                      }`}
                    >
                      {on && <span aria-hidden="true">✓ </span>}
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* 评价 */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className={labelCls + ' mb-0'}>学长学姐评价</p>
          <button
            type="button"
            onClick={addReview}
            className="cursor-pointer rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700"
          >
            + 添加评价
          </button>
        </div>

        <ul className="space-y-3">
          {draft.reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-200 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputCls}
                  value={r.author}
                  onChange={(e) => patchReview(r.id, { author: e.target.value })}
                  placeholder="署名，如 小红书 @abc"
                  aria-label="署名"
                />
                <input
                  className={inputCls}
                  value={r.semester}
                  onChange={(e) => patchReview(r.id, { semester: e.target.value })}
                  placeholder="学期，如 2024-25 Sem1"
                  aria-label="学期"
                />
              </div>
              <textarea
                rows={3}
                className={inputCls + ' mt-2'}
                value={r.content}
                onChange={(e) => patchReview(r.id, { content: e.target.value })}
                placeholder="评价内容"
                aria-label="评价内容"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">TA 的推荐分</span>
                  <StarRating
                    value={r.rating ?? 0}
                    onChange={(v) => patchReview(r.id, { rating: v })}
                    size="sm"
                    label="该同学评分"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeReview(r.id)}
                  className="cursor-pointer text-xs text-rose-600 hover:underline"
                >
                  删除这条
                </button>
              </div>
            </li>
          ))}
        </ul>

        {draft.reviews.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
            还没有评价，点上面「添加评价」。
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={submit}
          className="cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          取消
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            删除整门课
          </button>
        )}
      </div>
    </div>
  )
}
