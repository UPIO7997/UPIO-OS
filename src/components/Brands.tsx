import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Pencil, Trash2, Building2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"

export default function Brands() {
  const [search, setSearch] = useState('')
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', industry: '', contactPerson: '', contactEmail: '', status: 'Active'
  })

  const fetchBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "brands"))
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBrands(data)
    } catch (err) {
      console.error("Error fetching brands:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "brands", editingId), formData)
      } else {
        await addDoc(collection(db, "brands"), formData)
      }
      setIsDialogOpen(false)
      fetchBrands()
    } catch (err) {
      console.error("Error saving brand:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteDoc(doc(db, "brands", id))
        fetchBrands()
      } catch (err) {
        console.error("Error deleting:", err)
      }
    }
  }

  const openDialog = (brand: any = null) => {
    if (brand) {
      setEditingId(brand.id)
      setFormData({
        name: brand.name || '',
        industry: brand.industry || '',
        contactPerson: brand.contactPerson || '',
        contactEmail: brand.contactEmail || '',
        status: brand.status || 'Active'
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '', industry: '', contactPerson: '', contactEmail: '', status: 'Active'
      })
    }
    setIsDialogOpen(true)
  }

  const filteredBrands = brands.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (b.name || '').toLowerCase().includes(s) || 
           (b.industry || '').toLowerCase().includes(s);
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Operations</span>
            <h2 className="text-3xl font-bold tracking-tight">Brand Management</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 dark:bg-[#18181B] dark:border-[#27272A] text-xs font-bold rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">Export CSV</button>
          <button onClick={() => openDialog()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add Brand
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search brands..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-[#18181B]">
                <tr>
                  <th className="px-6 py-3 font-medium">Brand</th>
                  <th className="px-6 py-3 font-medium">Industry</th>
                  <th className="px-6 py-3 font-medium">Contact Person</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                ) : filteredBrands.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-zinc-500">No brands found.</td></tr>
                ) : filteredBrands.map((brand) => (
                  <tr key={brand.id} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center font-medium">
                           <Building2 className="h-4 w-4 text-zinc-500 dark:text-[#A1A1AA]" />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{brand.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{brand.industry}</td>
                    <td className="px-6 py-4 font-medium">{brand.contactPerson}</td>
                    <td className="px-6 py-4">{brand.contactEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        brand.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        brand.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {brand.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(brand)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
        <DialogContent className="sm:max-w-[425px] dark:bg-[#0C0C0E] dark:border-[#27272A]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Name</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Industry</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Contact Person</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Email</Label>
              <Input type="email" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Status</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Add Brand'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
