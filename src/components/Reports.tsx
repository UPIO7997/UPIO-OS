import { BarChart3 } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Analytics</span>
            <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[500px] text-zinc-500 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-[#27272A] flex items-center justify-center">
            <BarChart3 className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Advanced reports coming soon</h3>
          <p className="text-sm max-w-sm text-center">We're working on detailed exports, custom charts, and automated PDF reports for your enterprise.</p>
        </CardContent>
      </Card>
    </div>
  )
}
