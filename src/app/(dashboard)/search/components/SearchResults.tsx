'use client';

import { motion } from 'framer-motion';
import type { Candidate } from '@/types/search';

interface SearchResultsProps {
  results: Candidate[];
  isSearching: boolean;
  searchProgress?: number;
}

export default function SearchResults({ results, isSearching, searchProgress = 0 }: SearchResultsProps) {
  if (results.length === 0 && !isSearching) return null;
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-white mb-4">
        {isSearching ? 'Searching...' : 'Search Results'}
      </h3>
      
      {isSearching && (
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${searchProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">Analyzing candidate profiles...</p>
        </div>
      )}
      
      <div className="space-y-4">
        {results.map((candidate, index) => (
          <motion.div 
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-white">{candidate.name}</h4>
                <p className="text-gray-400 text-sm">{candidate.currentRole} at {candidate.company}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-800 text-white text-xs rounded">{skill}</span>
                  ))}
                  {candidate.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded">+{candidate.skills.length - 5} more</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-2.5 py-1 bg-white text-black rounded-full text-sm font-medium">
                  {candidate.matchScore}% Match
                </div>
                <p className="text-gray-400 text-xs mt-1">{candidate.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
