import { Cat } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

export default function NotAvailable() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mb-8"
      >
        <div className="relative w-32 h-32 bg-zinc-100 dark:bg-[#18181B] rounded-full flex items-center justify-center border border-zinc-200 dark:border-[#27272A]">
          <Cat className="w-16 h-16 text-primary dark:text-[#FAFAFA]" />
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            className="absolute -right-2 -top-2 text-4xl"
          >
            ☝️
          </motion.div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-[#FAFAFA]">Not Available For You</h2>
      <p className="text-zinc-500 dark:text-[#A1A1AA] max-w-md mb-8">
        Oops! It looks like you don't have the required access level to view this section. If you think this is a mistake, please contact the founder.
      </p>

      <Button onClick={() => navigate(-1)} variant="outline" className="dark:bg-[#18181B] dark:text-[#FAFAFA] dark:border-[#27272A]">
        Go Back
      </Button>
    </div>
  )
}
