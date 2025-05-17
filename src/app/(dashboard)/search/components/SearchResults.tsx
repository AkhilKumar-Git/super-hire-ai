'use client';

import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import type { Candidate } from '@/types/search';

interface SearchResultsProps {
  results: Candidate[];
  isSearching: boolean;
  searchProgress?: number;
  onSendEmail: (candidate: Candidate) => void;
}

export default function SearchResults({ 
  results, 
  isSearching, 
  searchProgress = 0,
  onSendEmail 
}: SearchResultsProps) {
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
        {results.map((candidate, index) => {
          // Create a unique key using candidate.id or fall back to index
          const uniqueKey = candidate.id || `candidate-${index}-${candidate.name || 'unknown'}`;
          
          return (
            <motion.div 
              key={uniqueKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-gray-800 rounded-lg p-4 hover:bg-gray-900"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{candidate.name}</h4>
                      <p className="text-gray-400 text-sm">{candidate.currentRole} at {candidate.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center px-2.5 py-1 bg-white text-black rounded-full text-sm font-medium">
                        {candidate.matchScore || 0}% Match
                      </div>
                      <button
                        onClick={() => onSendEmail(candidate)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                        title="Send email to candidate"
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(candidate.skills || []).slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-white text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills?.length > 5 && (
                      <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded">
                        +{candidate.skills.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-400">
                    {candidate.location && (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {candidate.location}
                      </span>
                    )}
                    {candidate.email && (
                      <span className="ml-4 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {candidate.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
