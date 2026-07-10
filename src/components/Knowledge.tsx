import { useState, useEffect } from 'react'
import { BookOpen, Search, Plus, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export default function Knowledge() {
  const [articles, setArticles] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' })

  const fetchArticles = async () => {
    const snap = await getDocs(collection(db, "knowledge"))
    setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleSave = async () => {
    if (editingId) {
      await updateDoc(doc(db, "knowledge", editingId), formData)
    } else {
      await addDoc(collection(db, "knowledge"), formData)
    }
    setIsDialogOpen(false)
    fetchArticles()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this article?')) {
      await deleteDoc(doc(db, "knowledge", id))
      fetchArticles()
    }
  }

  const openDialog = (article: any = null) => {
    if (article) {
      setEditingId(article.id)
      setFormData({ title: article.title, content: article.content, category: article.category })
    } else {
      setEditingId(null)
      setFormData({ title: '', content: '', category: 'General' })
    }
    setIsDialogOpen(true)
  }

  const filtered = articles.filter(a => (a.title || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Resources</span>
            <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          </div>
        </div>
        <Button onClick={() => openDialog()} className="bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B]">
          <Plus className="w-4 h-4 mr-2" /> Add Article
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input 
          className="pl-9 dark:bg-[#111113] dark:border-[#27272A]" 
          placeholder="Search articles..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(article => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader className="pb-3 border-b dark:border-[#27272A]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-primary mb-1 uppercase">{article.category}</div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openDialog(article)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <p className="text-sm text-zinc-600 dark:text-[#A1A1AA] line-clamp-4 whitespace-pre-wrap">
                {article.content}
              </p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No articles found. Create one to get started.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] dark:bg-[#0C0C0E] dark:border-[#27272A]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#FAFAFA]">{editingId ? 'Edit Article' : 'New Article'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="dark:text-[#FAFAFA]">Title</Label>
              <Input className="dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label className="dark:text-[#FAFAFA]">Category</Label>
              <Input className="dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label className="dark:text-[#FAFAFA]">Content</Label>
              <textarea 
                className="flex min-h-[200px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FAFAFA]"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
