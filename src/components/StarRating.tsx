interface Props {
  value: number
  onChange?: (v: number) => void
  /** 只读模式用于展示学长姐给的分 */
  readOnly?: boolean
  size?: 'sm' | 'md'
  label?: string
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  label = '评分',
}: Props) {
  const cls = size === 'sm' ? 'text-base' : 'text-2xl'

  if (readOnly) {
    return (
      <span className={`${cls} text-amber-500`} aria-label={`${label} ${value} 分，满分 5 分`}>
        {'★'.repeat(value)}
        <span className="text-slate-300">{'★'.repeat(Math.max(0, 5 - value))}</span>
      </span>
    )
  }

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} 分`}
          onClick={() => onChange?.(value === n ? 0 : n)}
          className={`${cls} cursor-pointer rounded px-0.5 leading-none transition-transform hover:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 ${
            n <= value ? 'text-amber-500' : 'text-slate-300 hover:text-amber-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
