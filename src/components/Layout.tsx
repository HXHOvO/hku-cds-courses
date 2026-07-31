import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../lib/store'

const navCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-sky-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export function Layout() {
  const { favorites } = useStore()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="mr-auto flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-sm font-bold text-white">
              EC
            </span>
            <span className="font-semibold text-slate-900">ECIC 选课参考</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navCls}>
              课程评价
            </NavLink>
            <NavLink to="/assistant" className={navCls}>
              选课小助手
            </NavLink>
            <NavLink to="/favorites" className={navCls}>
              <span className="inline-flex items-center gap-1.5">
                我的收藏
                {favorites.length > 0 && (
                  <span
                    className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      favorites.length > 0
                        ? 'bg-amber-100 text-amber-700'
                        : ''
                    }`}
                  >
                    {favorites.length}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink to="/admin" className={navCls}>
              管理
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-slate-400">
        <p>
          评价内容整理自小红书等公开分享，仅代表个别同学的主观体验，不代表学院或课程的官方信息。
        </p>
        <p className="mt-1">请结合最新的 course syllabus 自行判断。</p>
      </footer>
    </div>
  )
}
