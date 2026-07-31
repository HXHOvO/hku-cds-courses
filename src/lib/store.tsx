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
  clearFavoritesStorage,
  clearMyRatings,
  loadCourses,
  loadFavorites,
  loadMyRatings,
  resetCourses,
  saveCourses,
  saveFavorites,
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

  /** 收藏的课程编号列表 */
  favorites: string[]
  toggleFavorite: (code: string) => void
  isFavorite: (code: string) => boolean
  clearFavorites: () => void

  /** 管理员是否已解锁（仅本次会话有效） */
  isAdmin: boolean
  setIsAdmin: (v: boolean) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [courses, setCoursesState] = useState<Course[]>(() => loadCourses())
  const [myRatings, setMyRatings] = useState<MyRatings>(() => loadMyRatings())
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites())
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    saveMyRatings(myRatings)
  }, [myRatings])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

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

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }, [])

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites],
  )

  const clearFavorites = useCallback(() => {
    clearFavoritesStorage()
    setFavorites([])
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
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
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
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
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
