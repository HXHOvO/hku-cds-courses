/** 课程四大类 */
export const CATEGORIES = ['ICOM', 'ECOM', 'FITE', 'COMP'] as const
export type Category = (typeof CATEGORIES)[number]

/** 一条来自学长学姐的评价 */
export interface Review {
  id: string
  /** 来源署名，例如「小红书 @xxx」或「匿名学姐」 */
  author: string
  /** 修读学期，例如 2024-25 Sem1 */
  semester: string
  content: string
  /** 该学长姐给的推荐分 1-5，可留空 */
  rating?: number
}

/** 课程 */
export interface Course {
  /** 课程编号，例如 ECOM2001 */
  code: string
  /** 英文课程名 */
  name: string
  /** 中文备注名，可留空 */
  nameZh?: string
  category: Category
  /** 学分 */
  credits?: number
  /** 标签，取值建议用 TAGS 里的常量 */
  tags: string[]
  /** 课程简介（自己整理的一句话） */
  summary?: string
  reviews: Review[]
}
