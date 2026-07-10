import { useState } from 'react'
import { Cat, KeyRound, ArrowRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { motion } from 'motion/react'

interface LoginProps {
  onLogin: (role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const upperCode = code.trim().toUpperCase()

    if (upperCode === 'MAYANK') {
      try { localStorage.setItem('upio_auth', 'founder') } catch(e) {}
      onLogin('founder')
      return
    }

    if (/^UPIO\d+$/.test(upperCode)) {
      try { localStorage.setItem('upio_auth', 'employee') } catch(e) {}
      onLogin('employee')
      return
    }

    if (/^UPIF\d+$/.test(upperCode)) {
      try { localStorage.setItem('upio_auth', 'finance') } catch(e) {}
      onLogin('finance')
      return
    }

    if (/^UPIR\d+$/.test(upperCode)) {
      try { localStorage.setItem('upio_auth', 'research') } catch(e) {}
      onLogin('research')
      return
    }

    setError('Incorrect secret code. Try again.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090B] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-[#27272A] bg-white dark:bg-[#0C0C0E] overflow-hidden">
          <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center">
            
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-50 dark:opacity-20 animate-pulse"></div>
              <div className="relative bg-zinc-100 dark:bg-[#18181B] w-24 h-24 rounded-full flex items-center justify-center border border-zinc-200 dark:border-[#27272A]">
                <Cat className="w-12 h-12 text-primary dark:text-[#FAFAFA]" />
                <div className="absolute -right-1 -bottom-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-white dark:border-[#0C0C0E]">
                  <KeyRound className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2 dark:text-[#FAFAFA]">Tell me the secret</h1>
            <p className="text-sm text-zinc-500 dark:text-[#A1A1AA] mb-8">Enter your access code to enter UPIO OS.</p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password"
                  placeholder="Enter secret code..."
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError('')
                  }}
                  className="text-center font-mono tracking-widest text-lg h-12 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]"
                  autoFocus
                />
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-semibold transition-all hover:translate-y-[-2px] active:translate-y-[0px] dark:bg-[#FAFAFA] dark:text-[#09090B]">
                Enter System
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
