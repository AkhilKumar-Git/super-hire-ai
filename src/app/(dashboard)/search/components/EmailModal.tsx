'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Candidate } from '@/types/search';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  emailContent: string;
  onEmailContentChange: (content: string) => void;
  onGenerateEmail: () => Promise<void>;
  isGenerating: boolean;
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
}

export default function EmailModal({
  isOpen,
  onClose,
  candidate,
  emailContent,
  onEmailContentChange,
  onGenerateEmail,
  isGenerating,
  jobDescription,
  onJobDescriptionChange,
}: EmailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = async () => {
    if (!candidate?.email) return;
    
    try {
      setIsSending(true);
      // In a real app, you would send the email here
      console.log('Sending email to:', candidate.email);
      console.log('Email content:', emailContent);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSent(true);
      setTimeout(() => {
        onClose();
        setIsSending(false);
        setIsSent(false);
        onEmailContentChange('');
      }, 2000);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!candidate) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Send Email to {candidate.name}
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Job Description (for personalization)
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter job description to personalize the email..."
                      value={jobDescription}
                      onChange={(e) => onJobDescriptionChange(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-300">
                        Email Content
                      </label>
                      <button
                        type="button"
                        onClick={onGenerateEmail}
                        disabled={isGenerating}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Email content will be generated here..."
                      value={emailContent}
                      onChange={(e) => onEmailContentChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!emailContent || isSending || isSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSendEmail}
                    disabled={!emailContent || isSending || isSent}
                  >
                    {isSending ? 'Sending...' : isSent ? 'Sent!' : 'Send Email'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
