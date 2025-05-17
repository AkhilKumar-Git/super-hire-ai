// Types for search contexts and candidates

export interface ActiveFilters {
  useNaturalLanguage: boolean;
  useBooleanSearch: boolean;
  useJobDescription: boolean;
  useManualCriteria: boolean;
}

export interface ManualCriteria {
  role: string;
  skills: string[];
  experience: string;
  location: string;
  workType: string;
  industry?: string;
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

export interface Candidate {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  location: string;
  skills: string[];
  experience: string;
  education: string;
  matchScore: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  notes?: string;
}
