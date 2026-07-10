/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Influencers from './components/Influencers'
import ThemeInfluencers from './components/ThemeInfluencers'
import Brands from './components/Brands'
import Campaigns from './components/Campaigns'
import Finance from './components/Finance'
import Employees from './components/Employees'
import Tasks from './components/Tasks'
import CalendarView from './components/CalendarView'
import Knowledge from './components/Knowledge'
import Reports from './components/Reports'
import Settings from './components/Settings'
import Documents from './components/Documents'
import AiChat from './components/AiChat'
import Login from './components/Login'
import NotAvailable from './components/NotAvailable'
import { hasAccess } from './lib/permissions'

function ProtectedRoute({ children, path, role }: { children: React.ReactNode, path: string, role: string }) {
  if (!hasAccess(role, path)) {
    return <NotAvailable />
  }
  return <>{children}</>
}

export default function App() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem('upio_auth')
      if (authStatus) {
        setRole(authStatus)
      }
    } catch (e) {
      console.warn('localStorage is not accessible:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return null
  }

  if (!role) {
    return <Login onLogin={(r) => setRole(r)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            hasAccess(role, "/") 
              ? <ProtectedRoute path="/" role={role}><Dashboard /></ProtectedRoute>
              : <Navigate to={role === 'employee' ? '/influencers' : (role === 'research' ? '/employees' : '/')} replace />
          } />
          <Route path="influencers" element={<ProtectedRoute path="/influencers" role={role}><Influencers /></ProtectedRoute>} />
          <Route path="theme-influencers" element={<ProtectedRoute path="/theme-influencers" role={role}><ThemeInfluencers /></ProtectedRoute>} />
          <Route path="brands" element={<ProtectedRoute path="/brands" role={role}><Brands /></ProtectedRoute>} />
          <Route path="campaigns" element={<ProtectedRoute path="/campaigns" role={role}><Campaigns /></ProtectedRoute>} />
          <Route path="finance" element={<ProtectedRoute path="/finance" role={role}><Finance /></ProtectedRoute>} />
          <Route path="employees" element={<ProtectedRoute path="/employees" role={role}><Employees /></ProtectedRoute>} />
          <Route path="tasks" element={<ProtectedRoute path="/tasks" role={role}><Tasks /></ProtectedRoute>} />
          <Route path="calendar" element={<ProtectedRoute path="/calendar" role={role}><CalendarView /></ProtectedRoute>} />
          <Route path="knowledge" element={<ProtectedRoute path="/knowledge" role={role}><Knowledge /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute path="/reports" role={role}><Reports /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute path="/settings" role={role}><Settings /></ProtectedRoute>} />
          <Route path="documents" element={<ProtectedRoute path="/documents" role={role}><Documents /></ProtectedRoute>} />
          <Route path="ai" element={<ProtectedRoute path="/ai" role={role}><AiChat /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h2 className="text-xl font-semibold mb-2">Module Under Construction</h2>
              <p className="text-zinc-500">This UPIO OS module is currently being built by the engineering team.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

