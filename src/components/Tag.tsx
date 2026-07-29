import { tagColor } from '../data/tags'

export function Tag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColor(label)}`}
    >
      {label}
    </span>
  )
}

const CATEGORY_COLOR: Record<string, string> = {
  ICOM: 'bg-violet-600',
  ECOM: 'bg-orange-500',
  FITE: 'bg-cyan-600',
  COMP: 'bg-indigo-600',
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide text-white ${
        CATEGORY_COLOR[category] ?? 'bg-slate-500'
      }`}
    >
      {category}
    </span>
  )
}
