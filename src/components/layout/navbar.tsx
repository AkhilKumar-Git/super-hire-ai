import { motion } from "framer-motion"
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black text-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button className="rounded-md p-2 hover:bg-gray-900">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-white">HireAI</h1>
        </div>

        {/* Search bar removed as requested */}
        <div className="flex-1"></div>

        <div className="flex items-center space-x-4">
          <button className="relative rounded-full p-2 hover:bg-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 rounded-full p-1 pr-2 hover:bg-gray-900"
            >
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black text-sm font-medium">
                U
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-gray-800 bg-black shadow-lg focus:outline-none"
              >
                <div className="p-1">
                  <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-sm text-white hover:bg-gray-900">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-sm text-white hover:bg-gray-900">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
