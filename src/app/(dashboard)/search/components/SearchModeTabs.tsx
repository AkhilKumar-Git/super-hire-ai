'use client';

import { Sparkles, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchModeTabsProps {
  searchMode: 'combined' | 'manual';
  setSearchMode: (mode: 'combined' | 'manual') => void;
}

export default function SearchModeTabs({ searchMode, setSearchMode }: SearchModeTabsProps) {
  return (
    <div className="flex border-b border-gray-800 mb-6">
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
          searchMode === 'combined' 
            ? "text-white border-white" 
            : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700"
        )}
        onClick={() => setSearchMode('combined')}
      >
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Powered Search
        </div>
      </button>
      
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
          searchMode === 'manual' 
            ? "text-white border-white" 
            : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700"
        )}
        onClick={() => setSearchMode('manual')}
      >
        <div className="flex items-center">
          <Sliders className="h-4 w-4 mr-2" />
          Manual Selection
        </div>
      </button>
    </div>
  );
}
