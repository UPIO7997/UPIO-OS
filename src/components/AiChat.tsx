import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'model'
  content: string
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm the UPIO OS AI Assistant. How can I help you manage campaigns, influencers, or company knowledge today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history })
      })

      if (!response.ok) throw new Error('Failed to fetch response')
      
      const data = await response.json()
      
      setMessages(prev => [...prev, { role: 'model', content: data.reply }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 space-y-1">
        <span className="text-xs text-zinc-500 dark:text-[#71717A] font-medium uppercase tracking-wider">Enterprise</span>
        <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-sm text-zinc-500 dark:text-[#A1A1AA] pt-1">Ask questions, generate reports, or search company knowledge.</p>
      </div>
      
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, i) => (
            <div key={i} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'model' && (
                <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-primary/20 dark:border-primary/50 border dark:text-primary text-white flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user' 
                  ? 'bg-zinc-900 text-white dark:bg-[#18181B] dark:border dark:border-[#27272A] dark:text-[#FAFAFA]' 
                  : 'bg-zinc-100 text-zinc-900 dark:bg-[#1C1C1F] dark:border dark:border-[#27272A] dark:text-[#FAFAFA]'
              }`}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-[#27272A] border dark:border-[#3F3F46] flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-zinc-600 dark:text-[#FAFAFA]" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-primary/20 dark:border-primary/50 border dark:text-primary text-white flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-zinc-100 dark:bg-[#1C1C1F] dark:border dark:border-[#27272A] rounded-2xl px-4 py-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-zinc-400 dark:bg-[#71717A] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-zinc-400 dark:bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-zinc-400 dark:bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t border-zinc-200 dark:border-[#27272A]">
          <form onSubmit={handleSend} className="flex w-full gap-2">
            <Input 
              placeholder="Ask me anything..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-zinc-50 dark:bg-[#18181B] dark:border-[#27272A] dark:text-[#FAFAFA]"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2 bg-zinc-900 text-white dark:bg-primary dark:text-[#09090B] text-sm font-bold rounded-xl transition-colors hover:opacity-90 disabled:opacity-50 flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Send
            </button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
