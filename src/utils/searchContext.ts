import path from 'path';

// Types
export interface ManualCriteria {
  role: string;
  experience: string;
  skills: string[];
  location: string;
  workType: string;
}

export interface ActiveFilters {
  useNaturalLanguage: boolean;
  useBoolean: boolean;
  useBooleanSearch: boolean;
  useJobDescription: boolean;
  useManualCriteria: boolean;
}

export interface SearchContext {
  id: string;
  name: string;
  naturalLanguage: string;
  booleanSearch: string;
  jobDescription: string;
  manualCriteria: ManualCriteria;
  activeFilters: ActiveFilters;
  createdAt: string;
  updatedAt: string;
}

export interface SearchContextsData {
  contexts: SearchContext[];
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  currentRole: string;
  company: string;
  skills: string[];
  experience?: string;
  education?: string;
  profileUrl?: string;
  summary?: string;
  matchScore: number;
  source: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  notes?: string;
}

export interface SearchResult {
  searchId: string;
  searchName: string;
  timestamp: string;
  candidates: Candidate[];
}

export interface CandidateResultsData {
  results: SearchResult[];
}

// Mock data for search contexts
let mockSearchContexts: SearchContextsData = {
  contexts: []
};

// Helper function to ensure unique contexts by name
const ensureUniqueContexts = () => {
  // Create a map to store unique contexts by name
  const uniqueContexts = new Map<string, SearchContext>();
  
  // Add each context to the map, with name as key
  mockSearchContexts.contexts.forEach(context => {
    uniqueContexts.set(context.name, context);
  });
  
  // Convert map values back to array
  mockSearchContexts.contexts = Array.from(uniqueContexts.values());
};

// Mock data for candidate results
let mockCandidateResults: CandidateResultsData = {
  results: []
};

// Function to get all search contexts
export const getAllSearchContexts = (): SearchContext[] => {
  return mockSearchContexts.contexts;
};

// Function to get a specific search context by ID
export const getSearchContextById = (id: string): SearchContext | undefined => {
  const contexts = getAllSearchContexts();
  return contexts.find(context => context.id === id);
};

// Counter to ensure absolute uniqueness even if called multiple times in the same millisecond
let idCounter = 0;

// Generate a truly unique ID with UUID-like format
export const generateUniqueId = (): string => {
  // Increment counter for absolute uniqueness
  idCounter++;
  
  // Use a combination of timestamp, random string, and counter to ensure uniqueness
  return 'id-' + 
    Date.now().toString(36) + '-' + 
    Math.random().toString(36).substring(2, 10) + '-' +
    idCounter.toString(36); // Add counter as final segment
};

// Function to create a new search context
export const createSearchContext = (context: Omit<SearchContext, 'id' | 'createdAt' | 'updatedAt'>): SearchContext => {
  // Check if a context with the same name already exists
  const existingIndex = mockSearchContexts.contexts.findIndex(c => c.name === context.name);
  
  if (existingIndex >= 0) {
    // Update the existing context instead of creating a duplicate
    const updatedContext: SearchContext = {
      ...mockSearchContexts.contexts[existingIndex],
      ...context,
      updatedAt: new Date().toISOString()
    };
    
    mockSearchContexts.contexts[existingIndex] = updatedContext;
    return updatedContext;
  } else {
    // Create a new context with a unique ID
    const newContext: SearchContext = {
      ...context,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSearchContexts.contexts.push(newContext);
    return newContext;
  }
};

// Function to update an existing search context
export const updateSearchContext = (id: string, updates: Partial<Omit<SearchContext, 'id' | 'createdAt' | 'updatedAt'>>): SearchContext | undefined => {
  const index = mockSearchContexts.contexts.findIndex(context => context.id === id);
  if (index === -1) return undefined;
  
  const updatedContext: SearchContext = {
    ...mockSearchContexts.contexts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  mockSearchContexts.contexts[index] = updatedContext;
  
  return updatedContext;
};

// Function to delete a search context
export const deleteSearchContext = (id: string): boolean => {
  const initialLength = mockSearchContexts.contexts.length;
  mockSearchContexts.contexts = mockSearchContexts.contexts.filter(context => context.id !== id);
  
  if (mockSearchContexts.contexts.length === initialLength) return false;
  
  return true;
};

// Function to get all search results
export const getAllSearchResults = (): SearchResult[] => {
  return mockCandidateResults.results;
};

// Function to get search results for a specific search
export const getSearchResultsById = (searchId: string): SearchResult | undefined => {
  const results = getAllSearchResults();
  return results.find(result => result.searchId === searchId);
};

// Function to save new search results
export const saveSearchResults = (searchId: string, searchName: string, candidates: Candidate[]): SearchResult => {
  // Check if results for this search already exist
  const existingIndex = mockCandidateResults.results.findIndex(result => result.searchId === searchId);
  
  const newResult: SearchResult = {
    searchId,
    searchName,
    timestamp: new Date().toISOString(),
    candidates
  };
  
  if (existingIndex !== -1) {
    // Update existing results
    mockCandidateResults.results[existingIndex] = newResult;
  } else {
    // Add new results
    mockCandidateResults.results.push(newResult);
  }
  
  // Ensure uniqueness of search results by ID
  const uniqueResults = new Map<string, SearchResult>();
  mockCandidateResults.results.forEach(result => {
    uniqueResults.set(result.searchId, result);
  });
  
  // Update the results array with unique values
  mockCandidateResults.results = Array.from(uniqueResults.values());
  
  return newResult;
};

// Function to build a complete search prompt from context
export const buildSearchPrompt = (context: SearchContext): string => {
  const { naturalLanguage, booleanSearch, jobDescription, manualCriteria, activeFilters } = context;
  
  let prompt = '';
  
  // Always include natural language as the base
  prompt += naturalLanguage;
  
  // Add boolean search if active
  if (activeFilters.useBooleanSearch && booleanSearch) {
    prompt += `\n\nBoolean search criteria: ${booleanSearch}`;
  }
  
  // Add job description if active
  if (activeFilters.useJobDescription && jobDescription) {
    prompt += `\n\nJob description: ${jobDescription}`;
  }
  
  // Add manual criteria if active
  if (activeFilters.useManualCriteria && manualCriteria) {
    prompt += `\n\nAdditional criteria:`;
    if (manualCriteria.role) prompt += `\nRole: ${manualCriteria.role}`;
    if (manualCriteria.experience) prompt += `\nExperience: ${manualCriteria.experience}`;
    if (manualCriteria.skills.length > 0) prompt += `\nSkills: ${manualCriteria.skills.join(', ')}`;
    if (manualCriteria.location) prompt += `\nLocation: ${manualCriteria.location}`;
    if (manualCriteria.workType) prompt += `\nWork Type: ${manualCriteria.workType}`;
  }
  
  return prompt;
};

// Mock function to simulate AI search (in a real app, this would call an API)
export const performAISearch = async (prompt: string): Promise<Candidate[]> => {
  // This is just a mock that returns sample candidates
  // In a real app, this would call your backend API
  console.log('Performing AI search with prompt:', prompt);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a timestamp once to ensure unique IDs
  const timestamp = Date.now();
  
  // Return mock candidates
  return [
    {
      id: `c${timestamp}-1`,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      currentRole: 'Senior Frontend Engineer',
      company: 'TechCorp Inc.',
      experience: '8 years',
      skills: ['React', 'TypeScript', 'JavaScript', 'Redux', 'HTML/CSS', 'Next.js'],
      education: 'BS Computer Science, Stanford University',
      matchScore: 94,
      source: 'LinkedIn',
      notes: 'Strong team leadership experience, led frontend team of 5 developers'
    },
    {
      id: `c${timestamp}-2`,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '(555) 234-5678',
      location: 'Oakland, CA',
      currentRole: 'Frontend Team Lead',
      company: 'InnovateSoft',
      experience: '6 years',
      skills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'CSS-in-JS', 'Webpack'],
      education: 'MS Web Engineering, UC Berkeley',
      matchScore: 88,
      source: 'GitHub',
      notes: 'Active open source contributor, mentor at coding bootcamps'
    }
  ];
};
