import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { CourseDetail } from './pages/CourseDetail'
import { Assistant } from './pages/Assistant'
import { Favorites } from './pages/Favorites'
import { Compare } from './pages/Compare'
import { Admin } from './pages/Admin'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="course/:code" element={<CourseDetail />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="compare" element={<Compare />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
