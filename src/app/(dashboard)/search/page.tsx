'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  createSearchContext, 
  updateSearchContext,
  saveSearchResults, 
  buildSearchPrompt, 
  getAllSearchContexts,
  generateUniqueId 
} from '@/utils/searchContext';
import type { SearchContext, ManualCriteria, ActiveFilters, Candidate } from '@/types/search';
import { searchCandidates, generatePersonalizedEmail } from '@/lib/search';
import { 
  SearchHeader,
  NaturalLanguageSearch,
  BooleanSearch,
  JobDescriptionSearch,
  ManualSearch,
  SearchResults,
  SearchModeTabs,
  CombinedSearchTabs,
  EmailModal
} from './components';

// Sample data for suggested prompts
const suggestedPrompts = [
  'Senior React developer with TypeScript experience',
  'Full-stack engineer with Node.js and MongoDB',
  'Frontend developer with 5+ years experience',
  'Software engineer with fintech background'
];

// Experience levels for manual selection
const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (2-5 years)',
  'Senior Level (5+ years)',
  'Lead/Staff (8+ years)',
];

// Work types for manual selection
const workTypes = ['Remote', 'Hybrid', 'On-site'];

export default function SearchPage() {
  // Tab and search mode state
  const [activeTab, setActiveTab] = useState<'natural' | 'boolean' | 'jd'>('natural');
  const [searchMode, setSearchMode] = useState<'combined' | 'manual'>('combined');
  
  // Search results state
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  
  // Natural language search state
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  
  // Boolean search state
  const [booleanQuery, setBooleanQuery] = useState('');
  
  // Job description upload state
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Manual criteria selection state
  const [manualCriteria, setManualCriteria] = useState<ManualCriteria>({
    role: '',
    skills: [],
    experience: '',
    location: '',
    workType: '',
    industry: ''
  });
  const [skillInput, setSkillInput] = useState('');
  
  // Active filters state (for combined search)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    useNaturalLanguage: true,
    useBoolean: false,
    useBooleanSearch: false,
    useJobDescription: false,
    useManualCriteria: false
  });
  
  // Saved contexts state
  const [savedContexts, setSavedContexts] = useState<SearchContext[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load saved contexts on component mount and check for context parameter in URL
  useEffect(() => {
    try {
      const contexts = getAllSearchContexts();
      setSavedContexts(contexts);
      
      // Check if we have a context ID in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const contextId = urlParams.get('context');
      
      if (contextId) {
        // Find and load the context if it exists
        const context = contexts.find(ctx => ctx.id === contextId);
        if (context) {
          loadContext(contextId);
        }
      }
    } catch (error) {
      console.error('Error loading saved contexts:', error);
      setSavedContexts([]);
    }
  }, []);
  
  // Function to reset the search state for a new search
  const handleNewSearch = () => {
    // Reset all state variables
    setSelectedContextId(null);
    setSearchName('');
    setNaturalLanguageQuery('');
    setBooleanQuery('');
    setJobDescription('');
    setUploadedFile(null);
    setManualCriteria({
      role: '',
      skills: [],
      experience: '',
      location: '',
      workType: '',
      industry: ''
    });
    setSearchResults([]);
    
    // Reset search mode and active tab to defaults
    setSearchMode('combined');
    setActiveTab('natural');
    
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('context');
    window.history.pushState({}, '', url);
  };
  
  // Handler functions for file upload and drag/drop
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file contents
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJobDescription(content);
      };
      reader.readAsText(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleDragLeave = () => {
    setIsDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file contents
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJobDescription(content);
      };
      reader.readAsText(file);
    }
  };
  
  // Manual criteria management functions
  const addSkill = () => {
    if (skillInput.trim() && !manualCriteria.skills.includes(skillInput.trim())) {
      setManualCriteria(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setManualCriteria(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // Function to update preferences without creating a new saved search
  const updatePreferences = (type: 'boolean' | 'jd') => {
    // Just show a notification that preferences are updated
    alert(`${type === 'boolean' ? 'Boolean search' : 'Job description'} preferences saved for current search!`);
  };
  
  // Context management functions - only called from Natural Language tab
  const saveCurrentContext = () => {
    
    // If called from Natural Language component, save the full search context
    if (!searchName.trim()) {
      alert('Please provide a name for this search');
      return;
    }
    
    try {
      // Prepare the context data based on current search mode
      const contextData = {
        name: searchName,
        naturalLanguage: naturalLanguageQuery,
        booleanSearch: booleanQuery,
        jobDescription: jobDescription,
        manualCriteria: manualCriteria,
        activeFilters: searchMode === 'combined' ? {
          useNaturalLanguage: true, // Always use natural language in combined mode
          useBoolean: booleanQuery.trim() !== '',
          useBooleanSearch: booleanQuery.trim() !== '',
          useJobDescription: jobDescription.trim() !== '',
          useManualCriteria: false
        } : {
          useNaturalLanguage: false,
          useBoolean: false,
          useBooleanSearch: false,
          useJobDescription: false,
          useManualCriteria: true
        }
      };
      
      // Check if we're updating an existing context or creating a new one
      if (selectedContextId) {
        // Update existing context
        const updatedContext = updateSearchContext(selectedContextId, contextData);
        if (updatedContext) {
          // Update the contexts list with the updated context
          setSavedContexts(prev => prev.map(ctx => 
            ctx.id === selectedContextId ? updatedContext : ctx
          ));
          alert('Search context updated successfully!');
        } else {
          alert('Failed to update search context');
        }
      } else {
        // Create new context
        const newContext = createSearchContext(contextData);
        setSavedContexts(prev => [...prev, newContext]);
        setSelectedContextId(newContext.id);
        alert('Search context saved successfully!');
        
        // Update URL with the new context ID without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('context', newContext.id);
        window.history.pushState({}, '', url);
      }
      
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving search context:', error);
      alert('Failed to save search context');
    }
  };
  
  const loadContext = (contextId: string) => {
    const context = savedContexts.find(ctx => ctx.id === contextId);
    if (context) {
      // Load basic context data
      setSearchName(context.name);
      setNaturalLanguageQuery(context.naturalLanguage);
      setBooleanQuery(context.booleanSearch);
      setJobDescription(context.jobDescription);
      setManualCriteria(context.manualCriteria);
      
      // Determine search mode based on active filters
      if (context.activeFilters.useManualCriteria) {
        setSearchMode('manual');
      } else {
        setSearchMode('combined');
        
        // Set the active tab based on which filter is active
        if (context.activeFilters.useBooleanSearch) {
          setActiveTab('boolean');
        } else if (context.activeFilters.useJobDescription) {
          setActiveTab('jd');
        } else {
          setActiveTab('natural');
        }
      }
    }
  };
  
  // Search execution function
  const handleSearch = async () => {
    if (searchMode === 'combined' && !naturalLanguageQuery && !booleanQuery && !jobDescription && !Object.values(activeFilters).some(Boolean)) {
      alert('Please enter a search query or upload a job description');
      return;
    }

    if (searchMode === 'manual' && !manualCriteria.role && manualCriteria.skills.length === 0) {
      alert('Please enter at least a role or some skills');
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);

    try {
      // Simulate search progress
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Build search query based on active tab and search mode
      let searchQuery = '';
      
      if (searchMode === 'combined') {
        if (activeFilters.useNaturalLanguage && naturalLanguageQuery) {
          searchQuery = naturalLanguageQuery;
        } else if (activeFilters.useBoolean && booleanQuery) {
          searchQuery = booleanQuery;
        } else if (activeFilters.useJobDescription && jobDescription) {
          searchQuery = `Find candidates matching this job description: ${jobDescription.substring(0, 1000)}`;
        }
      } else {
        // Manual search mode
        searchQuery = `Find candidates with the following criteria:\n`;
        if (manualCriteria.role) searchQuery += `- Role: ${manualCriteria.role}\n`;
        if (manualCriteria.skills.length > 0) searchQuery += `- Skills: ${manualCriteria.skills.join(', ')}\n`;
        if (manualCriteria.experience) searchQuery += `- Experience: ${manualCriteria.experience}\n`;
        if (manualCriteria.location) searchQuery += `- Location: ${manualCriteria.location}\n`;
        if (manualCriteria.workType) searchQuery += `- Work Type: ${manualCriteria.workType}\n`;
      }

      // Create or update search context
      const contextId = selectedContextId || generateUniqueId();
      const contextData = {
        id: contextId,
        name: searchName || `Search ${new Date().toLocaleString()}`,
        naturalLanguage: naturalLanguageQuery,
        booleanSearch: booleanQuery,
        jobDescription: jobDescription,
        manualCriteria: manualCriteria,
        activeFilters: activeFilters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedContextId) {
        updateSearchContext(selectedContextId, contextData);
      } else {
        createSearchContext(contextData);
      }

      // Perform the actual search using our API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform search');
      }
      
      const { data: results, savedCount } = await response.json();
      
      // Save results and update state
      const searchResult = saveSearchResults(contextId, contextData.name, results);
      setSearchResults(searchResult.candidates);
      setSearchProgress(100);
      
      if (savedCount > 0) {
        console.log(`Saved ${savedCount} new candidates to storage`);
      }
      
      // Update saved contexts
      const contexts = getAllSearchContexts();
      setSavedContexts(contexts);
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Search error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while performing the search');
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <SearchHeader
        title="Candidate Search"
        subtitle="Find the perfect candidates using AI-powered search with natural language, boolean queries, or job descriptions."
        onNewSearch={handleNewSearch}
      />
      
      {/* Search Mode Tabs */}
      <SearchModeTabs
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />
      
      {/* Combined Search Tabs - Only shown when in combined mode */}
      {searchMode === 'combined' && (
        <CombinedSearchTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      
      {/* Search Interface */}
      <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
        {/* Natural Language Search */}
        {searchMode === 'combined' && activeTab === 'natural' && (
          <NaturalLanguageSearch
            naturalLanguageQuery={naturalLanguageQuery}
            setNaturalLanguageQuery={setNaturalLanguageQuery}
            booleanQuery={booleanQuery}
            setBooleanQuery={setBooleanQuery}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            suggestedPrompts={suggestedPrompts}
            savedContexts={savedContexts}
            selectedContextId={selectedContextId}
            searchName={searchName}
            setSearchName={setSearchName}
            showSaveDialog={showSaveDialog}
            setShowSaveDialog={setShowSaveDialog}
            loadContext={loadContext}
            saveCurrentContext={saveCurrentContext}
            handleSearch={handleSearch}
            isSearching={isSearching}
            searchProgress={searchProgress} 
            performSearch={handleSearch}          />
        )}
        
        {/* Boolean Search */}
        {searchMode === 'combined' && activeTab === 'boolean' && (
          <BooleanSearch
            booleanQuery={booleanQuery}
            setBooleanQuery={setBooleanQuery}
            savedContexts={savedContexts}
            selectedContextId={selectedContextId}
            searchName={searchName}
            setSearchName={setSearchName}
            loadContext={loadContext}
            updatePreferences={updatePreferences}
          />
        )}
        
        {/* Job Description Search */}
        {searchMode === 'combined' && activeTab === 'jd' && (
          <JobDescriptionSearch
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isDragActive={isDragActive}
            setIsDragActive={setIsDragActive}
            savedContexts={savedContexts}
            selectedContextId={selectedContextId}
            searchName={searchName}
            setSearchName={setSearchName}
            loadContext={loadContext}
            updatePreferences={updatePreferences}
            handleFileUpload={handleFileUpload}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        )}
        
        {/* Manual Selection */}
        {searchMode === 'manual' && (
          <ManualSearch
            manualCriteria={manualCriteria}
            setManualCriteria={setManualCriteria}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            savedContexts={savedContexts}
            selectedContextId={selectedContextId}
            searchName={searchName}
            setSearchName={setSearchName}
            showSaveDialog={showSaveDialog}
            setShowSaveDialog={setShowSaveDialog}
            loadContext={loadContext}
            saveCurrentContext={saveCurrentContext}
            performSearch={handleSearch}
            isSearching={isSearching}
            searchProgress={searchProgress}
            experienceLevels={experienceLevels}
            workTypes={workTypes}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        )}
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 || isSearching ? (
        <SearchResults 
          results={searchResults} 
          isSearching={isSearching} 
          searchProgress={searchProgress}
          onSendEmail={(candidate) => {
            setSelectedCandidate(candidate);
            setShowEmailModal(true);
          }}
        />
      ) : null}
      
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        candidate={selectedCandidate}
        emailContent={emailContent}
        onEmailContentChange={setEmailContent}
        onGenerateEmail={async () => {
          if (!selectedCandidate) return;
          
          try {
            setIsGeneratingEmail(true);
            const generatedEmail = await generatePersonalizedEmail(
              selectedCandidate,
              jobDescription || 'We are looking for a talented professional to join our team.'
            );
            setEmailContent(generatedEmail);
          } catch (error) {
            console.error('Error generating email:', error);
            alert('Failed to generate email. Please try again.');
          } finally {
            setIsGeneratingEmail(false);
          }
        }}
        isGenerating={isGeneratingEmail}
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
      />
    </div>
  );
}
