import { useState, useEffect } from 'react'
import { BarChart3, Download, TrendingUp, Users, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from './ui/button'

export default function Reports() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalInfluencers: 0,
    totalBudget: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      const [campSnap, infSnap] = await Promise.all([
        getDocs(collection(db, "campaigns")),
        getDocs(collection(db, "influencers"))
      ])
      
      const campaigns = campSnap.docs.map(d => d.data())
      const influencers = infSnap.docs.map(d => d.data())
      
      setStats({
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'Active').length,
        totalInfluencers: influencers.length,
        totalBudget: campaigns.reduce((acc, c) => acc + Number(c.budget || 0), 0)
      })
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Analytics</span>
            <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          </div>
        </div>
        <Button className="bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-zinc-500">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-zinc-500">Running right now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInfluencers}</div>
            <p className="text-xs text-zinc-500">In your network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold italic font-serif">${stats.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-zinc-500">Allocated to campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center border-t border-zinc-100 dark:border-[#27272A] text-zinc-500 text-sm">
          Detailed chart rendering will appear here. Connect more data sources to view insights.
        </CardContent>
      </Card>
    </div>
  )
}
