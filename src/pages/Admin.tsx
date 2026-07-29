import { useState } from 'react'
import { useStore } from '../lib/store'
import { ADMIN_PASSWORD } from '../data/config'
import type { Course } from '../types'
import { CourseEditor } from '../components/CourseEditor'
import { CategoryBadge, Tag } from '../components/Tag'
import { download, toCoursesSource } from '../lib/exportCourses'
import { hasDraft } from '../lib/storage'

export function Admin() {
  const { isAdmin, setIsAdmin } = useStore()
  return isAdmin ? <AdminPanel /> : <Gate onPass={() => setIsAdmin(true)} />
}

/* ------------------------------- 口令门 ------------------------------- */

function Gate({ onPass }: { onPass: () => void }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) onPass()
    else setErr(true)
  }

  return (
    <div className="mx-auto max-w-sm">
      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-bold text-slate-900">管理员登录</h1>
        <p className="mt-1 mb-4 text-sm text-slate-600">
          只有你能编辑课程评价和标签，其他同学只能查看。
        </p>
        <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="pwd">
          口令
        </label>
        <input
          id="pwd"
          type="password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value)
            setErr(false)
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
        />
        {err && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            口令不对
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full cursor-pointer rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          进入
        </button>
      </form>
    </div>
  )
}

/* ------------------------------ 管理面板 ------------------------------ */

const emptyCourse = (): Course => ({
  code: '',
  name: '',
  category: 'FITE',
  credits: 6,
  tags: [],
  reviews: [],
})

function AdminPanel() {
  const { courses, setCourses, restoreSeed, setIsAdmin } = useStore()
  /** null = 没在编辑；'new' = 新建；其他 = 正在编辑的课程 code */
  const [editing, setEditing] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const saveCourse = (course: Course) => {
    if (editing === 'new') {
      setCourses([...courses, course])
      flash(`已添加 ${course.code}`)
    } else {
      setCourses(courses.map((c) => (c.code === editing ? course : c)))
      flash(`已保存 ${course.code}`)
    }
    setEditing(null)
  }

  const deleteCourse = (code: string) => {
    if (!confirm(`确定删除 ${code} 及其所有评价？此操作不可撤销。`)) return
    setCourses(courses.filter((c) => c.code !== code))
    setEditing(null)
    flash(`已删除 ${code}`)
  }

  const exportFile = () => {
    download('courses.ts', toCoursesSource(courses))
    flash('已下载 courses.ts，请覆盖 src/data/courses.ts')
  }

  const reset = () => {
    if (!confirm('丢弃本机所有未导出的修改，恢复到 courses.ts 里的内容？')) return
    restoreSeed()
    setEditing(null)
    flash('已恢复')
  }

  const current =
    editing === 'new' ? emptyCourse() : courses.find((c) => c.code === editing)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-bold text-slate-900">管理课程</h1>
          <p className="text-sm text-slate-600">共 {courses.length} 门课程</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          退出管理
        </button>
      </div>

      {/* 工作流说明 */}
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">改完记得导出，否则别人看不到</p>
        <p className="mt-1">
          在这里的编辑只保存在你这台电脑的浏览器里。要让访问网站的同学看到新内容，需要：
        </p>
        <ol className="mt-1.5 ml-4 list-decimal space-y-0.5">
          <li>点下面「导出 courses.ts」</li>
          <li>
            用下载到的文件覆盖项目里的{' '}
            <code className="rounded bg-amber-100 px-1">src/data/courses.ts</code>
          </li>
          <li>重新部署（推到 GitHub 就会自动更新）</li>
        </ol>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + 新增课程
        </button>
        <button
          type="button"
          onClick={exportFile}
          className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          导出 courses.ts
        </button>
        {hasDraft() && (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            丢弃本机修改
          </button>
        )}
      </div>

      {toast && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800"
        >
          {toast}
        </p>
      )}

      {current && (
        <div className="mb-5">
          <CourseEditor
            course={current}
            takenCodes={courses
              .filter((c) => c.code !== editing)
              .map((c) => c.code)}
            onSave={saveCourse}
            onCancel={() => setEditing(null)}
            onDelete={
              editing !== 'new' ? () => deleteCourse(current.code) : undefined
            }
          />
        </div>
      )}

      <ul className="space-y-2">
        {[...courses]
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((c) => (
            <li
              key={c.code}
              className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={c.category} />
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-500">
                    {c.reviews.length} 条评价
                  </span>
                </div>
                <p className="mt-1 font-medium text-slate-900">{c.name}</p>
                {c.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEditing(c.code)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                编辑
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}
