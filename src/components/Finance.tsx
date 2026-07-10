import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"

export default function Finance() {
  const [search, setSearch] = useState('')
  const [finances, setFinances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'Income', date: '', category: '',
    brandName: '', brandEmail: '', brandNiche: '',
    influencer: '', influencerNiche: '', media: 'Instagram'
  })

  const fetchFinances = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "finances"))
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setFinances(data)
    } catch (err) {
      console.error("Error fetching finances:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinances()
  }, [])

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "finances", editingId), formData)
      } else {
        await addDoc(collection(db, "finances"), formData)
      }
      setIsDialogOpen(false)
      fetchFinances()
    } catch (err) {
      console.error("Error saving finance record:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, "finances", id))
        fetchFinances()
      } catch (err) {
        console.error("Error deleting:", err)
      }
    }
  }

  const openDialog = (record: any = null) => {
    if (record) {
      setEditingId(record.id)
      setFormData({
        title: record.title || '',
        amount: record.amount || '',
        type: record.type || 'Income',
        date: record.date || '',
        category: record.category || '',
        brandName: record.brandName || '',
        brandEmail: record.brandEmail || '',
        brandNiche: record.brandNiche || '',
        influencer: record.influencer || '',
        influencerNiche: record.influencerNiche || '',
        media: record.media || 'Instagram'
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '', amount: '', type: 'Income', date: '', category: '',
        brandName: '', brandEmail: '', brandNiche: '',
        influencer: '', influencerNiche: '', media: 'Instagram'
      })
    }
    setIsDialogOpen(true)
  }

  const filteredFinances = finances.filter(f => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (f.title || '').toLowerCase().includes(s) || 
           (f.category || '').toLowerCase().includes(s);
  })

  const totalIncome = finances.filter(f => f.type === 'Income').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const totalExpense = finances.filter(f => f.type === 'Expense').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Enterprise</span>
            <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 dark:bg-[#18181B] dark:border-[#27272A] text-xs font-bold rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">Export CSV</button>
          <button onClick={() => openDialog()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Total Balance</p>
          <h3 className="text-2xl font-bold italic font-serif">${(totalIncome - totalExpense).toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Total Income</p>
          <h3 className="text-2xl font-bold text-emerald-500">${totalIncome.toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Total Expenses</p>
          <h3 className="text-2xl font-bold text-red-500">${totalExpense.toLocaleString()}</h3>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search records..." 
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
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                ) : filteredFinances.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-zinc-500">No records found.</td></tr>
                ) : filteredFinances.map((record) => (
                  <tr key={record.id} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center font-medium">
                           <Wallet className="h-4 w-4 text-zinc-500 dark:text-[#A1A1AA]" />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{record.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{record.category}</td>
                    <td className="px-6 py-4">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 ${
                        record.type === 'Income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {record.type === 'Income' ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ${Number(record.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(record)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Record' : 'Add Record'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Title</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Brand Name</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Brand Email</Label>
              <Input type="email" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.brandEmail} onChange={e => setFormData({...formData, brandEmail: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Brand Niche</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.brandNiche} onChange={e => setFormData({...formData, brandNiche: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Influencer</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.influencer} onChange={e => setFormData({...formData, influencer: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Influencer Niche</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.influencerNiche} onChange={e => setFormData({...formData, influencerNiche: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Media</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.media} 
                onChange={e => setFormData({...formData, media: e.target.value})}
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Youtube">Youtube</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Linkedin">Linkedin</option>
                <option value="Tiktok">Tiktok</option>
                <option value="Josh">Josh</option>
                <option value="Moj">Moj</option>
                <option value="X">X</option>
                <option value="Thread">Thread</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Amount Paid</Label>
              <Input type="number" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Category</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Date</Label>
              <Input type="date" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Type</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Add Record'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
