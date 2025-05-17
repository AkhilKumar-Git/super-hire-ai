'use client';

import { Code2, Save, RefreshCw } from 'lucide-react';
import type { SearchContext } from '@/types/search';

interface BooleanSearchProps {
  booleanQuery: string;
  setBooleanQuery: (value: string) => void;
  savedContexts: SearchContext[];
  selectedContextId: string | null;
  searchName: string;
  setSearchName: (value: string) => void;
  loadContext: (contextId: string) => void;
  updatePreferences: (type: 'boolean' | 'jd') => void;
}

export default function BooleanSearch({
  booleanQuery,
  setBooleanQuery,
  savedContexts,
  selectedContextId,
  searchName,
  setSearchName,
  loadContext,
  updatePreferences
}: BooleanSearchProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white">
          <Code2 className="h-5 w-5" />
          <h2 className="font-medium">Boolean Search</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => updatePreferences('boolean')}
            className="px-3 py-1.5 border border-gray-800 rounded-lg text-sm text-white hover:bg-gray-900 flex items-center"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Preferences
          </button>
        </div>
      </div>
      

      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Enter Boolean Search Terms
          </label>
          <textarea
            value={booleanQuery}
            onChange={(e) => setBooleanQuery(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none font-mono"
            placeholder='Example: ("React" OR "React.js") AND ("TypeScript" OR "TS") AND "5+ years" AND NOT "junior"'
          ></textarea>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-white text-sm font-medium mb-2">Boolean Search Tips</h3>
          <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
            <li>Use <code className="text-white bg-gray-800 px-1 rounded">AND</code> to require multiple terms</li>
            <li>Use <code className="text-white bg-gray-800 px-1 rounded">OR</code> for alternatives</li>
            <li>Use <code className="text-white bg-gray-800 px-1 rounded">NOT</code> to exclude terms</li>
            <li>Use <code className="text-white bg-gray-800 px-1 rounded">"quotes"</code> for exact phrases</li>
            <li>Use <code className="text-white bg-gray-800 px-1 rounded">(parentheses)</code> to group terms</li>
          </ul>
        </div>
        
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400">
          <p>This boolean search criteria will be saved as part of your search context and can be used in combination with natural language search.</p>
        </div>
      </div>
    </div>
  );
}
