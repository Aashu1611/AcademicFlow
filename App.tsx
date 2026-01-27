import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import StatsChart from './components/StatsChart';
import { generateAcademicContent } from './services/geminiService';
import { FormData, GenerationResult } from './types';
import { GraduationCap, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    marks: '5',
    subject: 'General',
    tone: 'Formal'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<string>('');
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setCopied(false);
    
    try {
      const answer = await generateAcademicContent(formData);
      setCurrentResult(answer);

      // Add to history
      const newResult: GenerationResult = {
        id: Date.now().toString(),
        prompt: { ...formData },
        answer: answer,
        wordCount: answer.split(/\s+/).filter(w => w.length > 0).length,
        timestamp: Date.now(),
      };

      setHistory(prev => [...prev, newResult]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  }, [currentResult]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Academic<span className="text-brand-600">Flow</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Documentation</a>
              <div className="w-px h-4 bg-slate-200"></div>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div className="lg:sticky lg:top-24">
               <InputForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSubmit={handleGenerate} 
                  isLoading={isLoading} 
                />
                
                {/* Stats for larger screens (moved here visually) */}
                <div className="hidden lg:block">
                   <StatsChart history={history} />
                </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full">
            <div className="min-h-[500px] h-full">
              <ResultCard 
                content={currentResult} 
                wordCount={currentResult.split(/\s+/).filter(w => w.length > 0).length}
                onCopy={handleCopy}
                onRegenerate={handleGenerate}
                copied={copied}
                isLoading={isLoading}
              />
            </div>

            {/* Stats for mobile only */}
            <div className="block lg:hidden">
              <StatsChart history={history} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;