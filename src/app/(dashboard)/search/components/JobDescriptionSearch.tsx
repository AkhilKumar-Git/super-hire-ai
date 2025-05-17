'use client';

import { useRef } from 'react';
import { FileText, Upload, X, Save, RefreshCw } from 'lucide-react';
import type { SearchContext } from '@/types/search';

interface JobDescriptionSearchProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isDragActive: boolean;
  setIsDragActive: (value: boolean) => void;
  savedContexts: SearchContext[];
  selectedContextId: string | null;
  searchName: string;
  setSearchName: (value: string) => void;
  loadContext: (contextId: string) => void;
  updatePreferences: (type: 'boolean' | 'jd') => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function JobDescriptionSearch({
  jobDescription,
  setJobDescription,
  uploadedFile,
  setUploadedFile,
  isDragActive,
  setIsDragActive,
  savedContexts,
  selectedContextId,
  searchName,
  setSearchName,
  loadContext,
  updatePreferences,
  handleFileUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop
}: JobDescriptionSearchProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white">
          <FileText className="h-5 w-5" />
          <h2 className="font-medium">Job Description</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => updatePreferences('jd')}
            className="px-3 py-1.5 border border-gray-800 rounded-lg text-sm text-white hover:bg-gray-900 flex items-center"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Preferences
          </button>
        </div>
      </div>
      

      
      <div className="space-y-4">
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragActive ? 'border-white bg-gray-800' : 'border-gray-700'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <Upload className="h-10 w-10 text-gray-500" />
              <h3 className="text-white font-medium">Upload Job Description</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Drag and drop your job description file here, or click to browse
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mt-2"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">{uploadedFile.name}</span>
              </div>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setJobDescription('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 px-4 py-3 rounded-lg border border-gray-700 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
              placeholder="Job description content will appear here. You can also edit it directly."
            ></textarea>
          </div>
        )}
        
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400">
          <p>This job description will be saved as part of your search context and can be used in combination with natural language search.</p>
        </div>
      </div>
    </div>
  );
}
