import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Course } from '../types'
import {
  clearMyRatings,
  loadCourses,
  loadMyRatings,
  resetCourses,
  saveCourses,
  saveMyRatings,
  type MyRatings,
} from './storage'

interface StoreValue {
  courses: Course[]
  setCourses: (next: Course[]) => void
  /** 丢弃本机草稿，恢复到 courses.ts 里的数据 */
  restoreSeed: () => void

  myRatings: MyRatings
  setRating: (code: string, score: number) => void
  removeRating: (code: string) => void
  clearRatings: () => void

  /** 管理员是否已解锁（仅本次会话有效） */
  isAdmin: boolean
  setIsAdmin: (v: boolean) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [courses, setCoursesState] = useState<Course[]>(() => loadCourses())
  const [myRatings, setMyRatings] = useState<MyRatings>(() => loadMyRatings())
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    saveMyRatings(myRatings)
  }, [myRatings])

  const setCourses = useCallback((next: Course[]) => {
    setCoursesState(next)
    saveCourses(next)
  }, [])

  const restoreSeed = useCallback(() => {
    resetCourses()
    setCoursesState(loadCourses())
  }, [])

  const setRating = useCallback((code: string, score: number) => {
    setMyRatings((prev) => ({ ...prev, [code]: score }))
  }, [])

  const removeRating = useCallback((code: string) => {
    setMyRatings((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }, [])

  const clearRatings = useCallback(() => {
    clearMyRatings()
    setMyRatings({})
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      courses,
      setCourses,
      restoreSeed,
      myRatings,
      setRating,
      removeRating,
      clearRatings,
      isAdmin,
      setIsAdmin,
    }),
    [
      courses,
      setCourses,
      restoreSeed,
      myRatings,
      setRating,
      removeRating,
      clearRatings,
      isAdmin,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore 必须在 StoreProvider 内部使用')
  return ctx
}
