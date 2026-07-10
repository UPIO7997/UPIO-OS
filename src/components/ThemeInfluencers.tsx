import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"

export default function ThemeInfluencers() {
  const [search, setSearch] = useState('')
  const [themeInfluencers, setThemeInfluencers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', handle: '', platform: '', followers: '', niche: '', status: 'Active',
    location: '', budget: '', engagementRate: '', contactStatus: 'Not Contacted', email: '', lastMessage: ''
  })

  const fetchThemeInfluencers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "theme_influencers"))
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setThemeInfluencers(data)
    } catch (err) {
      console.error("Error fetching themeInfluencers:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThemeInfluencers()
  }, [])

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "theme_influencers", editingId), formData)
      } else {
        await addDoc(collection(db, "theme_influencers"), formData)
      }
      setIsDialogOpen(false)
      fetchThemeInfluencers()
    } catch (err) {
      console.error("Error saving influencer:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this influencer?")) {
      try {
        await deleteDoc(doc(db, "theme_influencers", id))
        fetchThemeInfluencers()
      } catch (err) {
        console.error("Error deleting:", err)
      }
    }
  }

  const openDialog = (inf: any = null) => {
    if (inf) {
      setEditingId(inf.id)
      setFormData({
        name: inf.name || '',
        handle: inf.handle || '',
        platform: inf.platform || '',
        followers: inf.followers || '',
        niche: inf.niche || inf.category || '',
        status: inf.status || 'Active',
        location: inf.location || '',
        budget: inf.budget || '',
        engagementRate: inf.engagementRate || '',
        contactStatus: inf.contactStatus || 'Not Contacted',
        email: inf.email || '',
        lastMessage: inf.lastMessage || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '', handle: '', platform: '', followers: '', niche: '', status: 'Active',
        location: '', budget: '', engagementRate: '', contactStatus: 'Not Contacted', email: '', lastMessage: ''
      })
    }
    setIsDialogOpen(true)
  }

  const filteredInfluencers = themeInfluencers.filter(inf => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (inf.name || '').toLowerCase().includes(s) || 
           (inf.handle || '').toLowerCase().includes(s);
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Operations</span>
            <h2 className="text-3xl font-bold tracking-tight">Theme Influencer Management</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-zinc-200 dark:bg-[#18181B] dark:border-[#27272A] text-xs font-bold rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">Export CSV</button>
          <button onClick={() => openDialog()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90 flex items-center">
            <Plus className="h-4 w-4 mr-1" /> Add Theme Influencer
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search theme influencers..." 
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
                  <th className="px-6 py-3 font-medium">Influencer</th>
                  <th className="px-6 py-3 font-medium">Platform</th>
                  <th className="px-6 py-3 font-medium">Followers</th>
                  <th className="px-6 py-3 font-medium">Niche</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                ) : filteredInfluencers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-zinc-500">No theme influencers found.</td></tr>
                ) : filteredInfluencers.map((inf) => (
                  <tr key={inf.id} className="border-b border-zinc-200 dark:border-[#27272A] hover:bg-zinc-50 dark:hover:bg-[#18181B]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center font-medium">
                          {inf.name ? inf.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-[#FAFAFA]">{inf.name}</div>
                          <div className="text-zinc-500 dark:text-[#71717A] text-xs">{inf.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{inf.platform}</td>
                    <td className="px-6 py-4 font-medium">{inf.followers}</td>
                    <td className="px-6 py-4">{inf.niche || inf.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inf.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        inf.status === 'In Campaign' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {inf.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(inf)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(inf.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Theme Influencer' : 'Add Theme Influencer'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Name</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Handle</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Email ID</Label>
              <Input type="email" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Niche</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Location</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Budget</Label>
              <Input type="number" className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Platform</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.platform} 
                onChange={e => setFormData({...formData, platform: e.target.value})}
              >
                <option value="">Select Platform...</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Josh">Josh</option>
                <option value="Moj">Moj</option>
                <option value="Thread">Thread</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Follower Count</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.followers} onChange={e => setFormData({...formData, followers: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Engagement Rate</Label>
              <Input className="col-span-3 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" placeholder="e.g. 4.5%" value={formData.engagementRate} onChange={e => setFormData({...formData, engagementRate: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Contact Status</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.contactStatus} 
                onChange={e => setFormData({...formData, contactStatus: e.target.value})}
              >
                <option value="Not Contacted">Not Contacted</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Negotiating">Negotiating</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Last Message</Label>
              <textarea 
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA] dark:placeholder:text-[#A1A1AA] dark:focus-visible:ring-zinc-300"
                value={formData.lastMessage} 
                onChange={e => setFormData({...formData, lastMessage: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right dark:text-[#FAFAFA]">Status</Label>
              <select 
                className="col-span-3 flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="In Campaign">In Campaign</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingId ? 'Save changes' : 'Add Theme Influencer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
