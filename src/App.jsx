import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
    </Routes>
  )
}
