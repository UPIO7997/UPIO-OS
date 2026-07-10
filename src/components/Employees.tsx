import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"

export default function Employees() {
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', salary: '', relationship: 'Single', role: 'Staff',
    perms: { viewFinances: false, editCampaigns: false, manageInfluencers: false }
  })

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"))
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEmployees(data)
    } catch (err) {
      console.error("Error fetching employees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "employees", editingId), formData)
      } else {
        await addDoc(collection(db, "employees"), formData)
      }
      setIsDialogOpen(false)
      fetchEmployees()
    } catch (err) {
      console.error("Error saving employee:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteDoc(doc(db, "employees", id))
        fetchEmployees()
      } catch (err) {
        console.error("Error deleting:", err)
      }
    }
  }

  const openDialog = (emp: any = null) => {
    if (emp) {
      setEditingId(emp.id)
      setFormData({
        name: emp.name || '',
        email: emp.email || '',
        contact: emp.contact || '',
        address: emp.address || '',
        salary: emp.salary || '',
        relationship: emp.relationship || 'Single',
        role: emp.role || 'Staff',
        perms: emp.perms || { viewFinances: false, editCampaigns: false, manageInfluencers: false }
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '', email: '', contact: '', address: '', salary: '', relationship: 'Single', role: 'Staff',
        perms: { viewFinances: false, editCampaigns: false, manageInfluencers: false }
      })
    }
    setIsDialogOpen(true)
  }

  const filteredEmployees = employees.filter(e => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (e.name || '').toLowerCase().includes(s) || 
           (e.email || '').toLowerCase().includes(s);
  })

  const togglePerm = (key: keyof typeof formData.perms) => {
    setFormData(prev => ({
      ...prev,
      perms: { ...prev.perms, [key]: !prev.perms[key] }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Internal</span>
            <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openDialog()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add Employee
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search employees..." 
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
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Salary</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-zinc-500">No employees found.</td></tr>
                ) : filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center font-medium">
                           <Users className="h-4 w-4 text-zinc-500 dark:text-[#A1A1AA]" />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{emp.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{emp.role}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.contact}</td>
                    <td className="px-6 py-4 font-medium">${Number(emp.salary || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(emp)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto dark:bg-[#0C0C0E] dark:border-[#27272A]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Name</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Email ID</Label>
              <Input type="email" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Contact Number</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Address</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Salary</Label>
              <Input type="number" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Relationship</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.relationship} 
                onChange={e => setFormData({...formData, relationship: e.target.value})}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Complicated">Complicated</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Role</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            
            <div className="col-span-4 mt-4 p-4 border border-zinc-200 dark:border-[#27272A] rounded-lg bg-zinc-50 dark:bg-[#111113]">
              <h4 className="text-sm font-semibold mb-3">Founder Access Controls</h4>
              <p className="text-xs text-zinc-500 mb-4">Toggle specific features this employee can view or edit.</p>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.perms.viewFinances} onChange={() => togglePerm('viewFinances')} className="rounded border-zinc-300" />
                  <span className="text-sm dark:text-zinc-300">View & Manage Finances</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.perms.editCampaigns} onChange={() => togglePerm('editCampaigns')} className="rounded border-zinc-300" />
                  <span className="text-sm dark:text-zinc-300">Edit Campaigns</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.perms.manageInfluencers} onChange={() => togglePerm('manageInfluencers')} className="rounded border-zinc-300" />
                  <span className="text-sm dark:text-zinc-300">Manage Influencers & Brands</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Add Employee'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
