import { useState } from 'react'
import { FileText, HardDrive, Plus, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export default function Documents() {
  const [isLoading, setIsLoading] = useState(false)
  const [docs, setDocs] = useState<any[]>([])

  const fetchDriveDocs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/drive')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setDocs(data.files || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Enterprise</span>
            <h2 className="text-3xl font-bold tracking-tight">Documents & Knowledge</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 dark:bg-[#18181B] dark:border-[#27272A] text-xs font-bold rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center" onClick={fetchDriveDocs} disabled={isLoading}>
            <HardDrive className="h-4 w-4 mr-1" /> {isLoading ? 'Syncing...' : 'Sync with Drive'}
          </button>
          <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> New Doc
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {docs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-[#18181B]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => (
                    <tr key={idx} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary dark:text-[#F27D26]" />
                        <span className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{doc.name}</span>
                      </td>
                      <td className="px-6 py-4">{doc.mimeType}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No documents synced</h3>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">Connect your Google Workspace account to sync strategy docs, brand guidelines, and campaign briefs.</p>
              <Button className="mt-6" onClick={fetchDriveDocs} disabled={isLoading}>
                {isLoading ? 'Syncing...' : 'Sync Workspace'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
