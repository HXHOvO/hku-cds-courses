/**
 * 全站统一的标签字典。
 * 只有这里定义过的标签才会出现在「选课小助手」的筛选面板里，
 * 所以新增标签请先加到这里，再到课程数据里使用。
 */

export interface TagDef {
  /** 标签文字，同时作为唯一 key */
  label: string
  /** 所属分组，用于筛选面板分区 */
  group: TagGroup
  /** Tailwind 配色 */
  color: string
}

export type TagGroup = '考核方式' | '工作量' | '教学体验' | '结果'

export const TAG_GROUPS: TagGroup[] = ['考核方式', '工作量', '教学体验', '结果']

export const TAGS: TagDef[] = [
  // ---- 考核方式 ----
  { label: '无考勤', group: '考核方式', color: 'bg-emerald-100 text-emerald-700' },
  { label: '有考勤', group: '考核方式', color: 'bg-rose-100 text-rose-700' },
  { label: '无期末考试', group: '考核方式', color: 'bg-emerald-100 text-emerald-700' },
  { label: '有期末考试', group: '考核方式', color: 'bg-rose-100 text-rose-700' },
  { label: '开卷考试', group: '考核方式', color: 'bg-emerald-100 text-emerald-700' },
  { label: '有期中考试', group: '考核方式', color: 'bg-amber-100 text-amber-700' },
  { label: '小组project', group: '考核方式', color: 'bg-sky-100 text-sky-700' },
  { label: '个人project', group: '考核方式', color: 'bg-sky-100 text-sky-700' },
  { label: '需要presentation', group: '考核方式', color: 'bg-amber-100 text-amber-700' },
  { label: '要写essay', group: '考核方式', color: 'bg-amber-100 text-amber-700' },

  // ---- 工作量 ----
  { label: '作业少', group: '工作量', color: 'bg-emerald-100 text-emerald-700' },
  { label: '作业多', group: '工作量', color: 'bg-rose-100 text-rose-700' },
  { label: '轻松', group: '工作量', color: 'bg-emerald-100 text-emerald-700' },
  { label: '工作量大', group: '工作量', color: 'bg-rose-100 text-rose-700' },
  { label: '需要写代码', group: '工作量', color: 'bg-sky-100 text-sky-700' },
  { label: '无需编程基础', group: '工作量', color: 'bg-emerald-100 text-emerald-700' },
  { label: '数学要求高', group: '工作量', color: 'bg-rose-100 text-rose-700' },

  // ---- 教学体验 ----
  { label: '讲课清楚', group: '教学体验', color: 'bg-emerald-100 text-emerald-700' },
  { label: '教授nice', group: '教学体验', color: 'bg-emerald-100 text-emerald-700' },
  { label: '有录播', group: '教学体验', color: 'bg-emerald-100 text-emerald-700' },
  { label: '内容实用', group: '教学体验', color: 'bg-sky-100 text-sky-700' },
  { label: '内容枯燥', group: '教学体验', color: 'bg-rose-100 text-rose-700' },
  { label: '课件质量差', group: '教学体验', color: 'bg-rose-100 text-rose-700' },

  // ---- 结果 ----
  { label: '给分高', group: '结果', color: 'bg-emerald-100 text-emerald-700' },
  { label: '给分一般', group: '结果', color: 'bg-amber-100 text-amber-700' },
  { label: '给分低', group: '结果', color: 'bg-rose-100 text-rose-700' },
  { label: '容易捞分', group: '结果', color: 'bg-emerald-100 text-emerald-700' },
  { label: '有curve', group: '结果', color: 'bg-sky-100 text-sky-700' },
]

const TAG_MAP = new Map(TAGS.map((t) => [t.label, t]))

/** 取标签配色，未登记的标签给一个中性色 */
export function tagColor(label: string): string {
  return TAG_MAP.get(label)?.color ?? 'bg-slate-100 text-slate-600'
}

export function tagsByGroup(group: TagGroup): TagDef[] {
  return TAGS.filter((t) => t.group === group)
}
