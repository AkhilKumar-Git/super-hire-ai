import { NextResponse } from 'next/server';
import { searchCandidates } from '@/lib/search';
import { saveCandidate, getCandidates } from '@/lib/storage';
import type { Candidate as SearchCandidate } from '@/types/search';

// Local type that matches the storage candidate type
interface StorageCandidate {
  id: string;
  name: string;
  email: string;
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
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function POST(request: Request) {
  try {
    const { query, filters = {} } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Perform the search and ensure results match our expected type
    const searchResults = (await searchCandidates(query, filters)) as unknown as SearchCandidate[];
    
    // Save new candidates to our storage
    const savedCandidates = [];
    
    for (const candidate of searchResults) {
      try {
        // Skip if no email (we need email as a unique identifier)
        if (!candidate.email) continue;
        
        // Check if candidate already exists by email
        const existingCandidates = await getCandidates() as unknown as StorageCandidate[];
        const exists = existingCandidates.some(
          (c) => c.email?.toLowerCase() === candidate.email!.toLowerCase()
        );
        
        if (!exists) {
          // Convert search candidate to storage candidate format
          const candidateToSave: Omit<StorageCandidate, 'id' | 'createdAt' | 'updatedAt'> = {
            name: candidate.name || 'Unknown',
            email: candidate.email!,
            phone: candidate.phone,
            location: candidate.location,
            currentRole: candidate.currentRole || 'Not specified',
            company: candidate.company || 'Not specified',
            skills: candidate.skills || [],
            experience: candidate.experience,
            education: candidate.education,
            profileUrl: candidate.profileUrl,
            summary: candidate.summary,
            matchScore: candidate.matchScore || 0,
            source: candidate.source || 'Search',
            notes: candidate.notes
          };
          
          const saved = await saveCandidate(candidateToSave);
          savedCandidates.push(saved);
        }
      } catch (error) {
        console.error('Error saving candidate:', error);
        // Continue with other candidates even if one fails
      }
    }

    // Return both search results and saved count
    return NextResponse.json({ 
      success: true, 
      data: searchResults,
      savedCount: savedCandidates.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
