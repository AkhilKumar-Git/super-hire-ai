'use client';

import { useState } from 'react';
import { Sparkles, Save, RefreshCw, Code2, FileText } from 'lucide-react';
import type { SearchContext } from '@/types/search';

interface NaturalLanguageSearchProps {
  naturalLanguageQuery: string;
  setNaturalLanguageQuery: (value: string) => void;
  booleanQuery: string;
  setBooleanQuery: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  suggestedPrompts: string[];
  savedContexts: SearchContext[];
  selectedContextId: string | null;
  searchName: string;
  setSearchName: (value: string) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (value: boolean) => void;
  loadContext: (contextId: string) => void;
  saveCurrentContext: () => void;
  performSearch: () => void;
  isSearching: boolean;
  searchProgress: number;
}

export default function NaturalLanguageSearch({
  naturalLanguageQuery,
  setNaturalLanguageQuery,
  booleanQuery,
  setBooleanQuery,
  jobDescription,
  setJobDescription,
  suggestedPrompts,
  savedContexts,
  selectedContextId,
  searchName,
  setSearchName,
  showSaveDialog,
  setShowSaveDialog,
  loadContext,
  saveCurrentContext,
  performSearch,
  isSearching,
  searchProgress
}: NaturalLanguageSearchProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-medium">Natural Language Search</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowSaveDialog(true)}
            className="px-3 py-1.5 border border-gray-800 rounded-lg text-sm text-white hover:bg-gray-900 flex items-center"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Search
          </button>
          
          {savedContexts.length > 0 && (
            <select
              className="px-3 py-1.5 border border-gray-800 rounded-lg text-sm bg-black text-white hover:bg-gray-900"
              value={selectedContextId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  loadContext(e.target.value);
                }
              }}
            >
              <option value="" className="bg-black">Load saved search</option>
              {savedContexts.map(context => (
                <option key={context.id} value={context.id} className="bg-black">
                  {context.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      {showSaveDialog && (
        <div className="mb-4 p-4 border border-gray-800 rounded-lg bg-gray-900">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Save Search</h3>
            <button 
              onClick={() => setShowSaveDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Search Name</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="E.g., Senior React Developer Search"
            />
          </div>
          <button
            onClick={saveCurrentContext}
            className="w-full px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Save Context
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Describe what you're looking for
          </label>
          <textarea
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            placeholder="Example: I need a senior React developer with TypeScript experience who has worked in fintech..."
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Suggested prompts
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setNaturalLanguageQuery(prompt)}
                className="text-left px-3 py-2 border border-gray-800 rounded-lg hover:bg-gray-900 text-sm text-gray-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 mb-2">
          <p className="text-sm text-gray-400">Available context for your search:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className={`px-3 py-1.5 rounded-full text-xs flex items-center ${booleanQuery ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}>
              <Code2 className="h-3.5 w-3.5 mr-1.5" />
              Boolean Search {booleanQuery ? '' : '(Not set)'}
              {booleanQuery && (
                <button 
                  onClick={() => setBooleanQuery('')}
                  className="ml-2 text-gray-400 hover:text-white"
                  title="Clear boolean search preferences"
                >
                  <span>×</span>
                </button>
              )}
            </div>
            
            <div className={`px-3 py-1.5 rounded-full text-xs flex items-center ${jobDescription ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}>
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Job Description {jobDescription ? '' : '(Not set)'}
              {jobDescription && (
                <button 
                  onClick={() => setJobDescription('')}
                  className="ml-2 text-gray-400 hover:text-white"
                  title="Clear job description preferences"
                >
                  <span>×</span>
                </button>
              )}
            </div>
          </div>
          
          {(!booleanQuery && !jobDescription) && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Tip: Add Boolean search terms or upload a job description to enhance your search results.
            </p>
          )}
        </div>
        
        <button
          type="button"
          onClick={performSearch}
          disabled={isSearching}
          className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </span>
          ) : (
            'Find Matching Candidates'
          )}
        </button>
        
        {isSearching && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-in-out"
                style={{ width: `${searchProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{searchProgress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
