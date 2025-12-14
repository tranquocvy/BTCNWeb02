import React from 'react'
import Header from '@/components/Header'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <NavBar />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </div>
  )
}
