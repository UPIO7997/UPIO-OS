import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, CheckSquare } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"

export default function Tasks() {
  const [search, setSearch] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '', description: '', assigneeId: '', status: 'To Do', dueDate: ''
  })

  const fetchData = async () => {
    try {
      const [tasksSnap, empSnap] = await Promise.all([
        getDocs(collection(db, "tasks")),
        getDocs(collection(db, "employees"))
      ])
      
      setTasks(tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setEmployees(empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "tasks", editingId), formData)
      } else {
        await addDoc(collection(db, "tasks"), formData)
      }
      setIsDialogOpen(false)
      fetchData()
    } catch (err) {
      console.error("Error saving task:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, "tasks", id))
        fetchData()
      } catch (err) {
        console.error("Error deleting:", err)
      }
    }
  }

  const openDialog = (task: any = null) => {
    if (task) {
      setEditingId(task.id)
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigneeId: task.assigneeId || '',
        status: task.status || 'To Do',
        dueDate: task.dueDate || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '', description: '', assigneeId: '', status: 'To Do', dueDate: ''
      })
    }
    setIsDialogOpen(true)
  }

  const filteredTasks = tasks.filter(t => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (t.title || '').toLowerCase().includes(s);
  })

  const getAssigneeName = (id: string) => {
    if (!id || id === 'Unassigned') return 'Unassigned'
    const emp = employees.find(e => e.id === id)
    return emp ? emp.name : 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Internal</span>
            <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openDialog()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kanban Board like view could go here, for now a table */}
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-[#18181B]">
                <tr>
                  <th className="px-6 py-3 font-medium">Task</th>
                  <th className="px-6 py-3 font-medium">Assignee</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
                ) : filteredTasks.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-zinc-500">No tasks found.</td></tr>
                ) : filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center font-medium">
                           <CheckSquare className="h-4 w-4 text-zinc-500 dark:text-[#A1A1AA]" />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{task.title}</div>
                          <div className="text-xs text-zinc-500 truncate max-w-[200px]">{task.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getAssigneeName(task.assigneeId)}</td>
                    <td className="px-6 py-4">{task.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-[#0C0C0E] dark:border-[#27272A]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Task' : 'New Task'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Title</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Description</Label>
              <textarea 
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA] dark:placeholder:text-[#A1A1AA] dark:focus-visible:ring-zinc-300"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Assignee</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.assigneeId} 
                onChange={e => setFormData({...formData, assigneeId: e.target.value})}
              >
                <option value="Unassigned">Unassigned</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Due Date</Label>
              <Input type="date" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Status</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="col-span-4 mt-2 px-3">
              <p className="text-xs text-zinc-500 italic">Tasks assigned to a specific employee will only be visible to them and the founder.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Create Task'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
