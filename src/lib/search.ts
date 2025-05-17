import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { Candidate } from '@/types/search';
import FirecrawlApp from '@mendable/firecrawl-js';

// Types for Firecrawl API response
interface FirecrawlSearchResult {
  url: string;
  title?: string;
  description?: string;
  markdown?: string;
  text?: string;
}

interface FirecrawlSearchResponse {
  data: FirecrawlSearchResult[];
}
// Firecrawl API configuration
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !process.env.FIRECRAWL_API_KEY;

if (USE_MOCK_DATA) {
  console.warn('FIRECRAWL_API_KEY is not set. Using mock data in development.');
}

// Initialize ChatOpenAI
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
  temperature: 0.7,
});

// Helper function to extract content from chat model response and clean markdown code blocks
const extractContent = (response: any): string => {
  let content = '';
  
  // Extract content from different response formats
  if (typeof response === 'string') {
    content = response;
  } else if (response?.content) {
    content = response.content;
  } else if (response?.text) {
    content = response.text;
  } else if (response && typeof response === 'object') {
    content = JSON.stringify(response);
  } else {
    content = String(response);
  }
  
  // Clean up markdown code blocks if present
  const codeBlockRegex = /```(?:json)?\n([\s\S]*?)\n```/;
  const match = content.match(codeBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return content.trim();
};

// Define the schema for candidate data
const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required').default('Unknown'),
  email: z.union([
    z.string().email('Invalid email format'),
    z.string().length(0),
    z.null()
  ]).optional().transform(e => e === "" ? undefined : e),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  currentRole: z.string().default('Not specified'),
  company: z.string().default('Not specified'),
  skills: z.array(z.string()).default([]),
  experience: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  profileUrl: z.string().url().optional().nullable(),
  summary: z.string().optional().nullable(),
  matchScore: z.number().min(0).max(100).default(0),
  source: z.string().default('LinkedIn Search'),
  id: z.string().optional(),
  notes: z.string().optional()
}).transform(data => ({
  ...data,
  // Ensure email is either a valid email or undefined
  email: data.email && data.email.includes('@') ? data.email : undefined
}));

type CandidateType = z.infer<typeof candidateSchema>;

// Parse natural language query
async function parseSearchQuery(query: string) {
  const template = `
  Extract the following information from the search query:
  - Job Title (required)
  - Skills (comma-separated list)
  - Location (optional)
  - Experience Level (entry, mid, senior, etc.)
  - Any other relevant keywords

  Query: ${query}

  Return the result as a JSON object with the following structure:
  {
    "jobTitle": string,
    "skills": string[],
    "location": string | null,
    "experienceLevel": string | null,
    "keywords": string[]
  }
  `;

  try {
    const response = await model.invoke([
      ['system', 'You are a helpful assistant that parses search queries into structured data.'],
      ['user', template]
    ]);
    
    const content = extractContent(response);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing search query:', error);
    // Fallback to a simple search
    return {
      jobTitle: query,
      skills: [],
      location: null,
      experienceLevel: null,
      keywords: query.split(/\s+/).filter(Boolean)
    };
  }
}

// Mock data for fallback
function getMockData() {
  return [
    {
      url: 'https://linkedin.com/in/johndoe',
      content: `John Doe is a Senior Software Engineer at Tech Corp with 5 years of experience in React, Node.js, and TypeScript. He has a Master's degree in Computer Science from Stanford University.`,
      title: 'John Doe | Senior Software Engineer at Tech Corp',
      description: 'Experienced Software Engineer with expertise in modern web technologies.'
    },
    {
      url: 'https://linkedin.com/in/janesmith',
      content: `Jane Smith is a Full Stack Developer at Web Solutions with 3 years of experience in JavaScript, Python, and AWS. She is based in San Francisco, CA.`,
      title: 'Jane Smith | Full Stack Developer at Web Solutions',
      description: 'Passionate developer with experience in building scalable web applications.'
    }
  ];
}

// Search for candidates using FireCrawl API
async function searchWithFireCrawl(query: any) {
  try {
    // Convert the query object to a search string
    let searchQuery = '';
    if (typeof query === 'string') {
      searchQuery = query;
    } else if (typeof query === 'object') {
      // Handle structured query object
      const { role, skills = [], experience, location, workType } = query;
      searchQuery = [
        role || '',
        ...skills,
        experience ? `${experience} years experience` : '',
        location || '',
        workType || ''
      ].filter(Boolean).join(' ');
    }
    
    // Add LinkedIn specific filters to the search
    const linkedinQuery = `${searchQuery} site:linkedin.com/in/`;
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for Firecrawl search with query:', linkedinQuery);
      return getMockData();
    }
    
    console.log('Searching Firecrawl API with query:', linkedinQuery);
    
    console.log('Searching Firecrawl API with query:', linkedinQuery);
    
    try {
      // For server-side calls, use the Firecrawl API directly
      if (typeof window === 'undefined') {
        const app = new FirecrawlApp({
          apiKey: process.env.FIRECRAWL_API_KEY || ''
        });
        
        const searchOptions = {
          limit: 5,
          pageContent: true,
          scrapeOptions: {
            onlyMainContent: true
          }
        } as const;
        
        const searchResult = await app.search(linkedinQuery, searchOptions);
        return searchResult.data.map((result: any) => ({
          url: result.url,
          content: result.markdown || result.text || result.description || 'No content available',
          title: result.title || 'No title',
          description: result.description || 'No description',
        }));
      }
      
      // For client-side calls, use the API route
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/firecrawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: linkedinQuery,
          options: {
            limit: 5,
            pageContent: true,
            scrapeOptions: {
              onlyMainContent: true
            }
          }
        }),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('Firecrawl API error:', error);
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        console.error('Firecrawl API returned error:', result.error);
        throw new Error(result.error || 'Failed to perform search');
      }
      
      const data = result.data;
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response format from Firecrawl API:', data);
        throw new Error('Invalid response format from search service');
      }
      
      // Transform the results to match our expected format
      return data.map((result) => ({
        url: result.url,
        content: result.markdown || result.text || result.description || 'No content available',
        title: result.title || 'No title',
        description: result.description || 'No description',
      }));
    } catch (error) {
      console.error('Error in Firecrawl search:', error);
      throw new Error('Failed to perform search. Please try again later.');
    }
  } catch (error) {
    console.error('Firecrawl search error:', error);
    // Fallback to mock data in case of error
    return getMockData();
  }
}

// Extract candidate information from page content
async function extractCandidateFromPage(content: string, query: any): Promise<CandidateType | null> {
  const systemPrompt = 'You are a helpful assistant that extracts and structures candidate information from text.';
  
  const userPrompt = `Extract candidate information from the following text and match it with the job requirements.
  
  Job Title: ${query.jobTitle || 'Not specified'}
  Required Skills: ${query.skills?.join(', ') || 'Not specified'}
  Location: ${query.location || 'Not specified'}
  Experience Level: ${query.experienceLevel || 'Not specified'}
  
  Candidate Information:
  ${content.substring(0, 10000)}
  
  Extract the following information:
  - Name (required)
  - Current Role (required)
  - Company (required)
  - Skills (array of strings, required)
  - Email (if available)
  - Phone (if available)
  - Location (if available)
  - Experience (if available)
  - Education (if available)
  - Profile URL (if available)
  - Summary (brief professional summary)
  - Match Score (0-100 based on how well they match the job requirements)
  
  Return the result as a JSON object that matches this structure:
  {
    "name": string,
    "currentRole": string,
    "company": string,
    "skills": string[],
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "experience": string | null,
    "education": string | null,
    "profileUrl": string | null,
    "summary": string,
    "matchScore": number,
    "source": string
  }`;
  
  try {
    const response = await model.invoke([
      ['system', systemPrompt],
      ['user', userPrompt]
    ]);
    
    const content = extractContent(response);
    
    // Try to extract JSON from the content if it's wrapped in markdown code blocks
    let jsonContent = content.trim();
    const jsonMatch = jsonContent.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Try to parse the content as JSON
    try {
      const candidate = JSON.parse(jsonContent);
      
      // Transform the candidate data to match our schema
      const transformedCandidate = {
        ...candidate,
        // Convert all values to strings and handle undefined/null
        name: candidate.name?.toString() || 'Unknown',
        email: candidate.email?.toString(),
        phone: candidate.phone?.toString(),
        location: candidate.location?.toString(),
        currentRole: candidate.currentRole?.toString() || 'Not specified',
        company: candidate.company?.toString() || 'Not specified',
        skills: Array.isArray(candidate.skills) 
          ? candidate.skills.map((s: any) => s?.toString())
          : (typeof candidate.skills === 'string' 
              ? candidate.skills.split(/[,\s]+/).filter(Boolean) 
              : []),
        experience: candidate.experience?.toString(),
        education: candidate.education?.toString(),
        profileUrl: candidate.profileUrl?.toString(),
        summary: candidate.summary?.toString(),
        matchScore: typeof candidate.matchScore === 'number' 
          ? Math.max(0, Math.min(100, candidate.matchScore)) 
          : (candidate.matchScore ? parseInt(candidate.matchScore, 10) || 0 : 0),
        source: candidate.source?.toString() || 'LinkedIn Search'
      };
      
      // Parse and validate with our schema
      return await candidateSchema.parseAsync(transformedCandidate);
      
    } catch (parseError) {
      console.error('Failed to parse candidate data as JSON:', parseError);
      console.log('Raw content that failed to parse:', jsonContent);
      
      // Fallback: Try to extract basic information from the text
      const nameMatch = content.match(/"name"\s*:\s*"([^"]+)"/i) || 
                       content.match(/name\s*[:=]\s*([^\n,;]+)/i);
      const emailMatch = content.match(/"email"\s*:\s*"([^"]+)"/i) || 
                        content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      
      try {
        const fallbackCandidate = {
          name: nameMatch ? nameMatch[1].trim() : 'Unknown',
          email: emailMatch ? emailMatch[0] : undefined,
          source: 'LinkedIn Search',
          matchScore: 0,
          skills: [],
          currentRole: 'Not specified',
          company: 'Not specified',
        };
        
        return await candidateSchema.parseAsync(fallbackCandidate);
      } catch (fallbackError) {
        console.error('Error in fallback candidate creation:', fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error('Error extracting candidate data:', error);
    return null;
  }
}

// Main search function
export async function searchCandidates(query: string, filters: Record<string, any> = {}): Promise<CandidateType[]> {
  try {
    // Parse the natural language query
    const parsedQuery = await parseSearchQuery(query);
    
    // Search for candidates using FireCrawl
    const pages = await searchWithFireCrawl(parsedQuery);
    
    // Extract candidate information from the pages
    const candidates: CandidateType[] = [];
    
    for (const page of pages) {
      try {
        const candidate = await extractCandidateFromPage(page.content, parsedQuery);
        if (candidate) {
          // Ensure matchScore is a valid number between 0-100
          const matchScore = typeof candidate.matchScore === 'number' 
            ? Math.max(0, Math.min(100, candidate.matchScore))
            : 0;
            
          // Only include candidates with a match score of at least 80
          if (matchScore >= 80) {
            candidates.push({
              ...candidate,
              matchScore // Ensure matchScore is properly set
            });
          }
        }
        
        // Limit to 10 candidates
        if (candidates.length >= 10) break;
      } catch (error) {
        console.error('Error processing page:', error);
      }
    }
    
    return candidates;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

// Function to generate a personalized email for a candidate
export async function generatePersonalizedEmail(candidate: CandidateType, jobDescription: string): Promise<string> {
  try {
    const candidateInfo = {
      ...candidate,
      skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : '',
      jobDescription: jobDescription || 'No job description provided',
      name: candidate.name || 'Candidate',
      currentRole: candidate.currentRole || 'their current role',
      company: candidate.company || 'their company'
    };

    const response = await model.invoke([
      ['system', 'You are a helpful assistant that generates professional, personalized emails to job candidates.'],
      ['user', `Write a personalized email to the candidate for a job opportunity.
      
      Candidate Information:
      - Name: ${candidateInfo.name}
      - Current Role: ${candidateInfo.currentRole}
      - Company: ${candidateInfo.company}
      - Skills: ${candidateInfo.skills}
      
      Job Description:
      ${candidateInfo.jobDescription}
      
      The email should be:
      - Professional but friendly
      - Personalized to the candidate's background
      - Highlight why they would be a good fit
      - Include a clear call to action
      - Be concise (under 200 words)`]
    ]);
    
    const email = extractContent(response);
    return email || 'Could not generate email. Please try again.';
  } catch (error) {
    console.error('Error generating email:', error);
    return 'Error generating personalized email. Please try again.';
  }
}

// Function to extract skills from a job description
export async function extractSkillsFromJobDescription(jobDescription: string): Promise<string[]> {
  try {
    const response = await model.invoke([
      ['system', 'You are a helpful assistant that extracts skills from job descriptions.'],
      ['user', `Extract the key technical skills and requirements from the following job description.
      Return them as a JSON array of strings.
      
      Job Description:
      ${jobDescription.substring(0, 5000)}
      
      Example output: ["JavaScript", "React", "Node.js"]`]
    ]);
    
    try {
      const content = extractContent(response);
      const skills = JSON.parse(content);
      return Array.isArray(skills) ? skills.map(String) : [];
    } catch (e) {
      console.error('Error parsing skills:', e);
      return [];
    }
  } catch (error) {
    console.error('Error extracting skills:', error);
    return [];
  }
}

// Function to calculate match score between candidate and job
export function calculateMatchScore(
  candidate: CandidateType,
  requiredSkills: string[],
  preferredSkills: string[] = []
): number {
  if (!requiredSkills?.length) return 0;
  
  const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  const preferredSkillsLower = preferredSkills.map(s => s.toLowerCase());
  
  // Calculate match for required skills (70% weight)
  const matchedRequired = requiredSkillsLower.filter(skill => 
    candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );
  const requiredScore = (matchedRequired.length / requiredSkillsLower.length) * 70;
  
  // Calculate match for preferred skills (30% weight)
  let preferredScore = 0;
  if (preferredSkillsLower.length > 0) {
    const matchedPreferred = preferredSkillsLower.filter(skill =>
      candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    );
    preferredScore = (matchedPreferred.length / preferredSkillsLower.length) * 30;
  } else {
    // If no preferred skills, give full weight to required skills
    preferredScore = 30 * (requiredScore / 70);
  }
  
  // Calculate total score (0-100)
  const totalScore = Math.min(100, Math.round(requiredScore + preferredScore));
  
  return totalScore;
}
