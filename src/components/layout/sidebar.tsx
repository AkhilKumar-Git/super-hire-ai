import { motion } from "framer-motion"
import { Home, Users, Search, BarChart2, Settings, Plus, BookmarkIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import { SearchContext } from '@/types/search'
import { getAllSearchContexts } from '@/utils/searchContext'

type NavItem = {
  name: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const pathname = usePathname()
  const [savedSearches, setSavedSearches] = useState<SearchContext[]>([])
  
  // Load saved searches on component mount and refresh every 2 seconds
  useEffect(() => {
    // Initial load
    loadSavedSearches();
    
    // Set up interval to refresh saved searches
    const intervalId = setInterval(loadSavedSearches, 2000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to load saved searches
  const loadSavedSearches = () => {
    try {
      const contexts = getAllSearchContexts();
      setSavedSearches(contexts);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  }

  const navItems: NavItem[] = [
    // { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Candidates', href: '/candidates', icon: <Users className="h-5 w-5" /> },
    { name: 'Search', href: '/search', icon: <Search className="h-5 w-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-800 bg-black text-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <h2 className="text-xl font-bold text-white">
            HireAI
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4">
            <Link href="/search">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black shadow-md transition-all hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Search</span>
              </motion.button>
            </Link>
          </div>
          
          <nav className="mt-6 space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute right-4 h-6 w-1 rounded-full bg-white"
                      />
                    )}
                  </Link>
                  
                  {/* Show saved searches under the Search nav item */}
                  {item.name === 'Search' && savedSearches.length > 0 && (
                    <div className="mt-2 ml-8 space-y-1">
                      <p className="text-xs text-gray-500 mb-1 ml-2">Saved Searches</p>
                      {savedSearches.map(search => (
                        <Link
                          key={search.id}
                          href={`/search?context=${search.id}`}
                          className="group flex items-center space-x-3 rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
                        >
                          <BookmarkIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-white" />
                          <span className="truncate">{search.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
