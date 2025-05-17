import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { Candidate } from '@/types/search';

// Initialize ChatOpenAI
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
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  currentRole: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().default([]),
  experience: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  matchScore: z.number().min(0).max(100).optional().default(0),
  source: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
}).refine(data => data.name && data.currentRole && data.company, {
  message: 'Name, current role, and company are required',
  path: ['name', 'currentRole', 'company']
});

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

// Search for candidates using FireCrawl (mock implementation)
async function searchWithFireCrawl(query: any) {
  // This is a mock implementation
  // In a real app, you would call the FireCrawl API here
  console.log('Searching with query:', query);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      url: 'https://linkedin.com/in/johndoe',
      content: `John Doe is a Senior Software Engineer at Tech Corp with 5 years of experience in React, Node.js, and TypeScript. He has a Master's degree in Computer Science from Stanford University.`
    },
    {
      url: 'https://linkedin.com/in/janesmith',
      content: `Jane Smith is a Full Stack Developer at Web Solutions with 3 years of experience in JavaScript, Python, and AWS. She is based in San Francisco, CA.`
    }
  ];
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
    const candidate = JSON.parse(content);
    
    // Ensure required fields are present and properly typed
    const parsedCandidate = {
      ...candidate,
      source: 'LinkedIn Search',
      matchScore: candidate.matchScore || 0, // Ensure matchScore is always a number
      skills: Array.isArray(candidate.skills) ? candidate.skills : [],
      name: candidate.name || 'Unknown',
      currentRole: candidate.currentRole || 'Not specified',
      company: candidate.company || 'Not specified',
    };
    
    return candidateSchema.parse(parsedCandidate);
  } catch (error) {
    console.error('Error parsing candidate data:', error);
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
