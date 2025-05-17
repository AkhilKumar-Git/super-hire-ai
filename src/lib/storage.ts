import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper to check if error has a code property
interface ErrorWithCode extends Error {
  code?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    const err = error as ErrorWithCode;
    if (err.code !== 'EEXIST') {
      console.error('Error creating data directory:', error);
      throw error;
    }
  }
}

// Generic function to read data from a JSON file
async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const err = error as ErrorWithCode;
    if (err.code === 'ENOENT') {
      // File doesn't exist, return default value
      return defaultValue;
    }
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Generic function to write data to a JSON file
async function writeData<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Candidate operations
export interface Candidate {
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
  matchScore?: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCandidates(): Promise<Candidate[]> {
  return readData<Candidate[]>('candidates', []);
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  const candidates = await getCandidates();
  return candidates.find(c => c.id === id);
}

export async function getCandidatesByIds(ids: string[]): Promise<Candidate[]> {
  if (!ids.length) return [];
  const candidates = await getCandidates();
  const idSet = new Set(ids);
  return candidates.filter(c => idSet.has(c.id));
}

export async function saveCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
  const candidates = await getCandidates();
  const now = new Date().toISOString();
  const newCandidate: Candidate = {
    ...candidate,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  candidates.push(newCandidate);
  await writeData('candidates', candidates);
  return newCandidate;
}

// List operations
export interface CandidateList {
  id: string;
  name: string;
  description?: string;
  candidateIds: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getLists(): Promise<CandidateList[]> {
  return readData<CandidateList[]>('lists', []);
}

export async function updateList(
  id: string, 
  updates: Partial<Omit<CandidateList, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CandidateList> {
  const lists = await getLists();
  const listIndex = lists.findIndex(list => list.id === id);
  
  if (listIndex === -1) {
    throw new Error(`List with ID ${id} not found`);
  }
  
  const now = new Date().toISOString();
  const updatedList: CandidateList = {
    ...lists[listIndex],
    ...updates,
    updatedAt: now,
  };
  
  lists[listIndex] = updatedList;
  await writeData('lists', lists);
  return updatedList;
}

export async function deleteList(id: string): Promise<void> {
  const lists = await getLists();
  const filtered = lists.filter(list => list.id !== id);
  
  if (filtered.length === lists.length) {
    throw new Error(`List with ID ${id} not found`);
  }
  
  await writeData('lists', filtered);
}

export async function getList(id: string): Promise<CandidateList | undefined> {
  const lists = await getLists();
  return lists.find(l => l.id === id);
}

export async function createList(list: Omit<CandidateList, 'id' | 'candidateIds' | 'createdAt' | 'updatedAt'>): Promise<CandidateList> {
  const lists = await getLists();
  const now = new Date().toISOString();
  const newList: CandidateList = {
    ...list,
    id: uuidv4(),
    candidateIds: [],
    createdAt: now,
    updatedAt: now,
  };
  
  lists.push(newList);
  await writeData('lists', lists);
  return newList;
}

export async function addCandidatesToList(listId: string, candidateIds: string[]): Promise<CandidateList> {
  const lists = await getLists();
  const listIndex = lists.findIndex(l => l.id === listId);
  
  if (listIndex === -1) {
    throw new Error(`List with ID ${listId} not found`);
  }
  
  // Remove duplicates and existing candidates
  const existingCandidates = new Set(lists[listIndex].candidateIds);
  const newCandidates = [...new Set(candidateIds)].filter(id => !existingCandidates.has(id));
  
  lists[listIndex] = {
    ...lists[listIndex],
    candidateIds: [...lists[listIndex].candidateIds, ...newCandidates],
    updatedAt: new Date().toISOString(),
  };
  
  await writeData('lists', lists);
  return lists[listIndex];
}

export async function removeCandidatesFromList(listId: string, candidateIds: string[]): Promise<CandidateList> {
  const lists = await getLists();
  const listIndex = lists.findIndex(l => l.id === listId);
  
  if (listIndex === -1) {
    throw new Error(`List with ID ${listId} not found`);
  }
  
  const candidateIdSet = new Set(candidateIds);
  lists[listIndex] = {
    ...lists[listIndex],
    candidateIds: lists[listIndex].candidateIds.filter(id => !candidateIdSet.has(id)),
    updatedAt: new Date().toISOString(),
  };
  
  await writeData('lists', lists);
  return lists[listIndex];
}

// Email Template operations
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  return readData<EmailTemplate[]>('emailTemplates', []);
}

export async function getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
  const templates = await getEmailTemplates();
  return templates.find(t => t.id === id);
}

export async function saveEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>, id?: string): Promise<EmailTemplate> {
  const templates = await getEmailTemplates();
  const now = new Date().toISOString();
  
  // If setting as default, unset any existing default
  if (template.isDefault) {
    for (const t of templates) {
      if (t.isDefault) {
        t.isDefault = false;
      }
    }
  }
  
  if (id) {
    // Update existing template
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Template with ID ${id} not found`);
    }
    
    const updatedTemplate: EmailTemplate = {
      ...templates[index],
      ...template,
      updatedAt: now,
    };
    
    templates[index] = updatedTemplate;
    await writeData('emailTemplates', templates);
    return updatedTemplate;
  } else {
    // Create new template
    const newTemplate: EmailTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    templates.push(newTemplate);
    await writeData('emailTemplates', templates);
    return newTemplate;
  }
}

export async function deleteEmailTemplate(id: string): Promise<void> {
  const templates = await getEmailTemplates();
  const filtered = templates.filter(t => t.id !== id);
  
  if (filtered.length === templates.length) {
    throw new Error(`Template with ID ${id} not found`);
  }
  
  await writeData('emailTemplates', filtered);
}

// Email Log operations
export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  content: string;
  status: 'SENT' | 'FAILED' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED';
  sentAt: string;
  candidateId: string;
  metadata?: Record<string, any>;
}

export async function logEmail(emailLog: Omit<EmailLog, 'id' | 'sentAt'>): Promise<EmailLog> {
  const logs = await readData<EmailLog[]>('emailLogs', []);
  const newLog: EmailLog = {
    ...emailLog,
    id: uuidv4(),
    sentAt: new Date().toISOString(),
  };
  
  logs.push(newLog);
  await writeData('emailLogs', logs);
  return newLog;
}

export async function getEmailLogs(candidateId?: string): Promise<EmailLog[]> {
  const logs = await readData<EmailLog[]>('emailLogs', []);
  if (candidateId) {
    return logs.filter(log => log.candidateId === candidateId);
  }
  return logs;
}
