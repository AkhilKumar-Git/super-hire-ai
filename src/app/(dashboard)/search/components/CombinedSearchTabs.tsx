'use client';

import { Sparkles, Code2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CombinedSearchTabsProps {
  activeTab: 'natural' | 'boolean' | 'jd';
  setActiveTab: (tab: 'natural' | 'boolean' | 'jd') => void;
}

export default function CombinedSearchTabs({ activeTab, setActiveTab }: CombinedSearchTabsProps) {
  return (
    <div className="flex border-b border-gray-800 mb-6">
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
          activeTab === 'natural' 
            ? "text-white border-white" 
            : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700"
        )}
        onClick={() => setActiveTab('natural')}
      >
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Natural Language
        </div>
      </button>
      
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
          activeTab === 'boolean' 
            ? "text-white border-white" 
            : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700"
        )}
        onClick={() => setActiveTab('boolean')}
      >
        <div className="flex items-center">
          <Code2 className="h-4 w-4 mr-2" />
          Boolean Search
        </div>
      </button>
      
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
          activeTab === 'jd' 
            ? "text-white border-white" 
            : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700"
        )}
        onClick={() => setActiveTab('jd')}
      >
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Job Description
        </div>
      </button>
    </div>
  );
}
