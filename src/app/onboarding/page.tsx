'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

type OnboardingStep = 'welcome' | 'role' | 'company' | 'preferences' | 'complete';

type UserPreferences = {
  role: string;
  companyName: string;
  companySize: string;
  hiringNeeds: string[];
  preferredTools: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [preferences, setPreferences] = useState<UserPreferences>({
    role: '',
    companyName: '',
    companySize: '',
    hiringNeeds: [],
    preferredTools: []
  });

  const handleNext = () => {
    const steps: OnboardingStep[] = ['welcome', 'role', 'company', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ['welcome', 'role', 'company', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleInputChange = (field: keyof UserPreferences, value: string | string[]) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (field: keyof UserPreferences, value: string) => {
    const current = Array.isArray(preferences[field]) 
      ? (preferences[field] as string[]) 
      : [];
    
    const newValue = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    handleInputChange(field, newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save preferences to database/context here
    console.log('User preferences:', preferences);
    handleNext(); // Move to complete step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to HireAI</h2>
            <p className="text-gray-300 mb-8">
              Let's get started by setting up your account. This will help us personalize your experience.
            </p>
          </div>
        );
      
      case 'role':
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">What's your role?</h2>
            <div className="space-y-4">
              {['Founder', 'Hiring Manager', 'Recruiter', 'HR Professional', 'Other'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleInputChange('role', role)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    preferences.role === role 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  } transition-colors`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'company':
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Tell us about your company</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={preferences.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Acme Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Size
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['1-10', '11-50', '51-200', '201-1000', '1000+'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleInputChange('companySize', size)}
                      className={`p-3 rounded-lg border ${
                        preferences.companySize === size 
                          ? 'border-primary-500 bg-primary-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      } transition-colors`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'preferences':
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Your hiring preferences</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-3">What are your hiring needs?</h3>
                <div className="space-y-2">
                  {[
                    'Technical roles (Developers, Engineers, etc.)',
                    'Non-technical roles (Marketing, Sales, etc.)',
                    'Executive/C-level positions',
                    'Contract/Freelance positions',
                    'Interns/Entry-level'
                  ].map((need) => (
                    <label key={need} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={preferences.hiringNeeds.includes(need)}
                        onChange={() => toggleArrayItem('hiringNeeds', need)}
                        className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                      />
                      <span>{need}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Preferred hiring tools (select all that apply)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'LinkedIn',
                    'Indeed',
                    'Greenhouse',
                    'Lever',
                    'Workable',
                    'BambooHR',
                    'Other ATS'
                  ].map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleArrayItem('preferredTools', tool)}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        preferences.preferredTools.includes(tool)
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      } transition-colors`}
                    >
                      <span>{tool}</span>
                      {preferences.preferredTools.includes(tool) && (
                        <Check className="h-5 w-5 text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
            <p className="text-gray-300 mb-8">
              Your account is ready. Let's start finding your next great hire.
            </p>
            <button
              onClick={() => router.push('/(dashboard)/search')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors flex items-center mx-auto gap-2"
            >
              Start Searching
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 'complete';
  const isFirstStep = currentStep === 'welcome';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-effect rounded-2xl p-8 md:p-12">
        {!isLastStep && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Set up your account</h1>
            <div className="text-sm text-gray-400">
              Step {['welcome', 'role', 'company', 'preferences'].indexOf(currentStep) + 1} of 4
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}

          {!isLastStep && (
            <div className="flex justify-between pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border ${
                  isFirstStep 
                    ? 'border-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800/50'
                } transition-colors`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              
              <button
                type={currentStep === 'preferences' ? 'submit' : 'button'}
                onClick={currentStep !== 'preferences' ? handleNext : undefined}
                disabled={currentStep === 'role' && !preferences.role}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg ${
                  (currentStep === 'role' && !preferences.role) ||
                  (currentStep === 'company' && (!preferences.companyName || !preferences.companySize))
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                } transition-colors`}
              >
                {currentStep === 'preferences' ? 'Complete Setup' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
