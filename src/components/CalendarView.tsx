import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from './ui/button'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const [tasksSnap, campaignsSnap] = await Promise.all([
        getDocs(collection(db, "tasks")),
        getDocs(collection(db, "campaigns"))
      ])
      
      const tasks = tasksSnap.docs.map(d => ({...d.data(), id: d.id, type: 'task'}))
      const campaigns = campaignsSnap.docs.map(d => ({...d.data(), id: d.id, type: 'campaign'}))
      setEvents([...tasks, ...campaigns])
    }
    fetchEvents()
  }, [])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.dueDate === dateStr || e.startDate === dateStr)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Planning</span>
            <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-[#27272A] rounded-lg overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-zinc-50 dark:bg-[#18181B] p-2 text-center text-xs font-medium text-zinc-500 uppercase">
                {day}
              </div>
            ))}
            
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="bg-white dark:bg-[#111113] min-h-[120px] p-2" />
            ))}
            
            {days.map(day => {
              const dayEvents = getEventsForDate(day)
              return (
                <div key={day} className="bg-white dark:bg-[#111113] min-h-[120px] p-2 border-t border-zinc-100 dark:border-[#27272A]">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{day}</span>
                  <div className="mt-2 space-y-1">
                    {dayEvents.map((evt, i) => (
                      <div key={i} className={`text-[10px] px-1.5 py-1 rounded truncate ${evt.type === 'task' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {evt.title || evt.name}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
