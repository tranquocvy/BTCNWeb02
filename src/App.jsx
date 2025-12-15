import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Search from './pages/Search'
import MovieDetail from './pages/MovieDetail'
import PersonDetail from './pages/PersonDetail'
import AuthPage from './pages/Auth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
      <Route path="/movie/:id" element={<MainLayout><MovieDetail /></MainLayout>} />
      <Route path="/person/:id" element={<MainLayout><PersonDetail /></MainLayout>} />
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  )
}
