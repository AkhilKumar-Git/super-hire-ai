'use client';

import { useState } from 'react';
import { Sliders, Save, RefreshCw, X, Plus } from 'lucide-react';
import type { SearchContext, ManualCriteria } from '@/types/search';

interface ManualSearchProps {
  manualCriteria: ManualCriteria;
  setManualCriteria: (criteria: ManualCriteria) => void;
  skillInput: string;
  setSkillInput: (value: string) => void;
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
  experienceLevels: string[];
  workTypes: string[];
  addSkill: () => void;
  removeSkill: (skill: string) => void;
}

export default function ManualSearch({
  manualCriteria,
  setManualCriteria,
  skillInput,
  setSkillInput,
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
  searchProgress,
  experienceLevels,
  workTypes,
  addSkill,
  removeSkill
}: ManualSearchProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white">
          <Sliders className="h-5 w-5" />
          <h2 className="font-medium">Manual Selection</h2>
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
      
      <div className="space-y-6">
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Role
          </label>
          <input
            type="text"
            value={manualCriteria.role}
            onChange={(e) => setManualCriteria({...manualCriteria, role: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="E.g., Senior React Developer"
          />
        </div>
        
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Skills
          </label>
          <div className="flex">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="flex-1 px-3 py-2 rounded-l-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="E.g., React, TypeScript, Node.js"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-2 bg-gray-800 text-white rounded-r-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {manualCriteria.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {manualCriteria.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center px-3 py-1.5 bg-gray-800 text-white rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Experience and Work Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Experience Level
            </label>
            <select
              value={manualCriteria.experience}
              onChange={(e) => setManualCriteria({...manualCriteria, experience: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              <option value="" className="bg-black">Select experience level</option>
              {experienceLevels.map((level, index) => (
                <option key={index} value={level} className="bg-black">
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Work Type
            </label>
            <select
              value={manualCriteria.workType}
              onChange={(e) => setManualCriteria({...manualCriteria, workType: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
            >
              <option value="" className="bg-black">Select work type</option>
              {workTypes.map((type, index) => (
                <option key={index} value={type} className="bg-black">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Location and Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              value={manualCriteria.location}
              onChange={(e) => setManualCriteria({...manualCriteria, location: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="E.g., Remote, San Francisco, Europe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Industry
            </label>
            <input
              type="text"
              value={manualCriteria.industry || ''}
              onChange={(e) => setManualCriteria({...manualCriteria, industry: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="E.g., Fintech, Healthcare, E-commerce"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={performSearch}
          disabled={isSearching || (!manualCriteria.role && manualCriteria.skills.length === 0)}
          className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
