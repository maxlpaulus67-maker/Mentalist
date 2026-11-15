import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AreasPage from './pages/AreasPage'
import AreaPage from './pages/AreaPage'
import Stats from './pages/Stats'
import Info from './pages/Info'
import Daily from './pages/Daily'
import { LessonView } from './areas/mimik/Lessons'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bereiche" element={<AreasPage />} />
        <Route path="bereich/:areaId" element={<AreaPage />} />
        <Route path="bereich/mimik/lektion/:lessonId" element={<LessonView />} />
        <Route path="training" element={<Daily />} />
        <Route path="statistik" element={<Stats />} />
        <Route path="info" element={<Info />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
