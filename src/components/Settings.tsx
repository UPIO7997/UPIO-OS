import { useState } from 'react'
import { Settings as SettingsIcon, Trash2, Check, Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { db } from '../lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

export default function Settings() {
  const [isDeleting, setIsDeleting] = useState(false)

  const wipeFinances = async () => {
    if (confirm("Are you sure you want to permanently delete all financial records? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        const querySnapshot = await getDocs(collection(db, "finances"))
        const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, "finances", d.id)))
        await Promise.all(deletePromises)
        alert("All financial records have been deleted.")
      } catch (err) {
        console.error("Error wiping finances:", err)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">System</span>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-[#FAFAFA]">Theme</p>
                <p className="text-sm text-zinc-500">Toggle dark mode manually.</p>
              </div>
              <Button onClick={toggleTheme} variant="outline" size="icon">
                <Moon className="h-4 w-4 hidden dark:block" />
                <Sun className="h-4 w-4 dark:hidden" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium dark:text-[#FAFAFA]">Wipe Finances Data</p>
                <p className="text-sm text-zinc-500">Delete all financial records to start from zero.</p>
              </div>
              <Button onClick={wipeFinances} disabled={isDeleting} variant="destructive">
                {isDeleting ? 'Deleting...' : 'Reset Finances'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
