/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="influencers" element={<Influencers />} />
          <Route path="theme-influencers" element={<ThemeInfluencers />} />
          <Route path="brands" element={<Brands />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="finance" element={<Finance />} />
          <Route path="employees" element={<Employees />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="documents" element={<Documents />} />
          <Route path="ai" element={<AiChat />} />
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
