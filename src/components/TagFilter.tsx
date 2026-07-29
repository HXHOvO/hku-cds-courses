import { TAG_GROUPS, tagColor, tagsByGroup } from '../data/tags'

interface Props {
  selected: string[]
  onToggle: (label: string) => void
  onClear: () => void
  /** 只显示课程库里真实用到的标签 */
  available: Set<string>
}

export function TagFilter({ selected, onToggle, onClear, available }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">按标签筛选</h2>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-xs text-sky-600 hover:underline"
          >
            清空 ({selected.length})
          </button>
        )}
      </div>

      <p className="mb-3 text-xs text-slate-500">
        多选是「且」的关系，比如同时选「无考勤」和「无期末考试」，只会留下两个条件都满足的课。
      </p>

      <div className="space-y-3">
        {TAG_GROUPS.map((group) => {
          const tags = tagsByGroup(group).filter((t) => available.has(t.label))
          if (tags.length === 0) return null
          return (
            <fieldset key={group}>
              <legend className="mb-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {group}
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const on = selected.includes(t.label)
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => onToggle(t.label)}
                      aria-pressed={on}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 ${
                        on
                          ? 'bg-slate-900 text-white'
                          : `${tagColor(t.label)} hover:ring-2 hover:ring-slate-300`
                      }`}
                    >
                      {on && <span aria-hidden="true">✓ </span>}
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>
    </div>
  )
}
