import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Users, 
  Building2, 
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock
} from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function Dashboard() {
  const [finances, setFinances] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [influencers, setInfluencers] = useState<any[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financeSnap, campSnap, infSnap] = await Promise.all([
          getDocs(collection(db, "finances")),
          getDocs(collection(db, "campaigns")),
          getDocs(collection(db, "influencers"))
        ])
        
        setFinances(financeSnap.docs.map(d => d.data()))
        setCampaigns(campSnap.docs.map(d => d.data()))
        setInfluencers(infSnap.docs.map(d => d.data()))
      } catch(err) {
        console.error("Error fetching dashboard data", err)
      }
    }
    fetchData()
  }, [])

  const totalIncome = finances.filter(f => f.type === 'Income').reduce((sum, curr) => sum + Number(curr.amount || 0), 0)
  const totalExpense = finances.filter(f => f.type === 'Expense').reduce((sum, curr) => sum + Number(curr.amount || 0), 0)
  const netProfit = totalIncome * 0.20 // 20% profit calculation as requested

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div>
            <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Operational Overview</span>
            <h2 className="text-3xl font-bold tracking-tight">Founder Dashboard</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-[#FAFAFA] dark:text-[#09090B] text-xs font-bold rounded-lg transition-colors hover:opacity-90">Export Report</button>
          <button className="px-4 py-2 bg-white border border-zinc-200 dark:bg-[#18181B] dark:border-[#27272A] text-xs font-bold rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">Edit Layout</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Monthly Revenue</p>
          <h3 className="text-2xl font-bold italic font-serif">${totalIncome.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
            <span>+0.0%</span><span className="text-zinc-500 dark:text-[#52525B] font-normal">vs last month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Net Profit</p>
          <h3 className="text-2xl font-bold">${netProfit.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
            <span>+0.0%</span><span className="text-zinc-500 dark:text-[#52525B] font-normal">vs last month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Active Campaigns</p>
          <h3 className="text-2xl font-bold">{campaigns.length}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-primary dark:text-[#F27D26] font-bold">
            <span>{campaigns.filter(c => c.status === 'Planning').length} Pending</span><span className="text-zinc-500 dark:text-[#52525B] font-normal">awaiting approval</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] p-5 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-[#71717A] text-xs font-medium mb-1">Total Influencers</p>
          <h3 className="text-2xl font-bold">{influencers.length}</h3>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
            <span>+0 New</span><span className="text-zinc-500 dark:text-[#52525B] font-normal">onboarded today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[340px]">
        {/* Campaign Pulse */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] rounded-2xl flex flex-col shadow-sm">
          <div className="p-5 border-b border-zinc-200 dark:border-[#27272A] flex justify-between items-center">
            <h4 className="text-sm font-semibold">Campaign Pulse</h4>
            <span className="text-[10px] text-zinc-500 dark:text-[#A1A1AA] uppercase font-bold tracking-wider">Live Performance Metrics</span>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-end gap-2">
            <div className="flex items-end gap-2 flex-1 px-4">
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[30%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[45%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-primary dark:bg-[#F27D26] rounded-t-sm h-[85%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[40%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[55%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[70%]"></div>
              <div className="w-full bg-zinc-200 dark:bg-[#27272A] rounded-t-sm h-[35%]"></div>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 dark:text-[#71717A] uppercase font-bold pt-2 px-4">
              <span>01 Oct</span><span>08 Oct</span><span>15 Oct</span><span>22 Oct</span><span>29 Oct</span>
            </div>
          </div>
        </div>

        {/* AI Executive Summary */}
        <div className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-[#27272A] rounded-2xl flex flex-col shadow-sm">
          <div className="p-5 border-b border-zinc-200 dark:border-[#27272A]">
            <h4 className="text-sm font-semibold">AI Executive Summary</h4>
          </div>
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            <div className="relative p-4 bg-primary/5 dark:bg-[#F27D26]/5 border-l-2 border-primary dark:border-[#F27D26] rounded-r-lg">
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-[#D4D4D8]">
                Campaign <span className="font-bold text-zinc-900 dark:text-white underline decoration-primary/40 dark:decoration-[#F27D26]/40">'Luxe Summer'</span> is outperforming targets by 22%. Recommend increasing budget for top 3 influencers.
              </p>
            </div>
            <div className="space-y-3 pt-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-[#27272A] flex items-center justify-center text-[10px] text-zinc-900 dark:text-white font-medium">1</div>
                <p className="text-xs text-zinc-500 dark:text-[#A1A1AA]">3 Invoices ready for founder approval</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-[#27272A] flex items-center justify-center text-[10px] text-zinc-900 dark:text-white font-medium">2</div>
                <p className="text-xs text-zinc-500 dark:text-[#A1A1AA]">Influencer retention up by 4.2%</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-[#27272A] flex items-center justify-center text-[10px] text-zinc-900 dark:text-white font-medium">3</div>
                <p className="text-xs text-zinc-500 dark:text-[#A1A1AA]">Quarterly goal reached 14 days early</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-zinc-50 dark:bg-[#1C1C1F] text-primary dark:text-[#F27D26] text-[10px] font-bold uppercase tracking-widest border border-primary/20 dark:border-[#F27D26]/30 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors">
              Generate Action Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
