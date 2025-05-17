"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Mail, Phone, Star, MoreHorizontal, Download, UserPlus } from "lucide-react";
import { getCandidates, Candidate as StorageCandidate } from "@/lib/storage";
import { searchCandidates } from "@/lib/search";

type Status = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position: string; // maps to currentRole
  experience?: string;
  status: Status;
  match: number; // maps to matchScore
  lastContact: string;
  isFavorite: boolean;
  company?: string;
  skills?: string[];
  location?: string;
  summary?: string;
}

const statusColors: Record<Status, string> = {
  'New': 'bg-white text-black',
  'Screening': 'bg-white text-black',
  'Interview': 'bg-white text-black',
  'Offer': 'bg-white text-black',
  'Hired': 'bg-white text-black',
  'Rejected': 'bg-white text-black',
};

// Function to convert stored candidates to the UI format
function mapStorageCandidateToUI(candidate: StorageCandidate): Candidate {
  return {
    id: candidate.id,
    name: candidate.name || 'Unknown',
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.currentRole || 'Not specified',
    experience: candidate.experience,
    status: 'New', // Default status for new candidates
    match: candidate.matchScore || 0,
    lastContact: 'Just added', // New candidates haven't been contacted yet
    isFavorite: false, // Default to not favorited
    company: candidate.company,
    skills: candidate.skills,
    location: candidate.location,
    summary: candidate.summary
  };
}

export default function CandidatesPage(): JSX.Element {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load candidates from storage on component mount
  useEffect(() => {
    async function loadCandidates() {
      try {
        setIsLoading(true);
        const storedCandidates = await getCandidates();
        
        if (storedCandidates.length > 0) {
          // Convert stored candidates to UI format
          const uiCandidates = storedCandidates.map(mapStorageCandidateToUI);
          setCandidates(uiCandidates);
        } else {
          setError('No candidates found. Try searching to add candidates.');
        }
      } catch (err) {
        console.error('Error loading candidates:', err);
        setError('Failed to load candidates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCandidates();
  }, []);

  // Handle search submission
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Perform search with the query
      const searchResults = await searchCandidates(searchQuery);
      
      if (searchResults.length > 0) {
        // Convert search results to UI format and add to candidates
        const newCandidates = searchResults.map(result => ({
          id: result.id || Math.random().toString(36).substring(2, 9),
          name: result.name || 'Unknown',
          email: result.email,
          phone: result.phone,
          position: result.currentRole || 'Not specified',
          experience: result.experience,
          status: 'New' as Status,
          match: result.matchScore || 0,
          lastContact: 'Just found',
          isFavorite: false,
          company: result.company,
          skills: result.skills,
          location: result.location,
          summary: result.summary
        }));
        
        // Update the state with the new candidates
        setCandidates((prevCandidates: Candidate[]) => [...newCandidates, ...prevCandidates]);
      } else {
        setError('No candidates found for your search. Try different keywords.');
      }
    } catch (err) {
      console.error('Error searching for candidates:', err);
      setError('Failed to search for candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
          <p className="text-gray-400">Manage and track your candidate pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-md border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-200"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Candidate
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-800 bg-black p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <form onSubmit={handleSearch} className="relative flex-1 md:max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-800 bg-black py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSearch(e as unknown as React.FormEvent<HTMLFormElement>)}
              className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
            >
              <Search className="mr-1.5 h-4 w-4" />
              <span>Search</span>
            </button>
            <div className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900">
              <Filter className="mr-1.5 h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8 rounded-lg bg-black border border-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading candidates...</span>
        </div>
      ) : error ? (
        <div className="p-8 rounded-lg bg-black border border-gray-800 text-center">
          <p className="text-red-400 mb-3">{error}</p>
          <p className="text-gray-400">Try searching for candidates using the search box above.</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="p-8 rounded-lg bg-black border border-gray-800 text-center">
          <p className="text-gray-400 mb-3">No candidates found.</p>
          <p className="text-gray-400">Search for candidates to get started.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden shadow-md rounded-lg bg-black border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Candidate</th>
                  <th scope="col" className="px-6 py-3">Position</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Match</th>
                  <th scope="col" className="px-6 py-3">Last Contact</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {candidates.map((candidate: Candidate, index: number) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-900"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-black text-sm font-medium">
                          {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-white">{candidate.name}</p>
                            {candidate.isFavorite && (
                              <Star className="ml-1 h-3.5 w-3.5 text-white fill-white" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            {candidate.email && (
                              <>
                                <a href={`mailto:${candidate.email}`} className="hover:text-white hover:underline">
                                  <Mail className="inline h-3 w-3 mr-1" />
                                  <span>Email</span>
                                </a>
                                {candidate.phone && <span>•</span>}
                              </>
                            )}
                            {candidate.phone && (
                              <a href={`tel:${candidate.phone}`} className="hover:text-white hover:underline">
                                <Phone className="inline h-3 w-3 mr-1" />
                                <span>Call</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{candidate.position}</p>
                        <p className="text-xs text-gray-400">{candidate.experience ? `${candidate.experience} experience` : 'Experience unknown'}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[candidate.status]}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-white"></div>
                        <span className="text-sm font-medium text-white">{candidate.match}%</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                      {candidate.lastContact}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {candidates.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{candidates.length}</span> of{' '}
            <span className="font-medium text-white">{candidates.length}</span> candidates
          </div>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
