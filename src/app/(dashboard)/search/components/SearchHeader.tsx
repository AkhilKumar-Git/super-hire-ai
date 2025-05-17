'use client';

import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

interface SearchHeaderProps {
  title: string;
  subtitle: string;
  onNewSearch?: () => void;
}

export default function SearchHeader({ title, subtitle, onNewSearch }: SearchHeaderProps) {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-2"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-xl">
            <Search className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        
        {onNewSearch && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewSearch}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Search</span>
          </motion.button>
        )}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-400 max-w-2xl"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
