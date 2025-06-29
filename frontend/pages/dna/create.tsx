import { useRef, useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ProfileCreationForm from '../../components/ProfileCreationForm';
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Creator } from '../../types/Creator';

const steps = [
  'Step 1: Upload Audio',
  'Step 2: DNA Sensitivity',
  'Step 3: Profile Creation',
  'Step 4: Tagging and Categorization',
  'Publish',
];

function StepProgressBar({ currentStep, onStepClick, step3Done }: { currentStep: number; onStepClick: (idx: number) => void; step3Done: boolean }) {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center w-full max-w-[1200px] mx-auto">
        {steps.map((step, idx) => {
          // Only allow navigation to steps <= currentStep, or to Step 4/5 if step3Done
          const isLocked = (idx > currentStep && (!step3Done || idx > 4)) || (idx >= 3 && !step3Done);
          const isCurrent = idx === currentStep;
          return (
            <button
              key={step}
              onClick={() => !isLocked && onStepClick(idx)}
              className={`px-2 sm:px-6 py-2 sm:py-3 rounded-full font-power-grotesk text-xs sm:text-base font-medium transition-all duration-200 whitespace-nowrap outline-none
                ${isCurrent
                  ? 'bg-[#007D49] text-white shadow-lg scale-105'
                  : 'bg-[#232428] text-[#B0B3B8]'}
                ${isLocked ? 'cursor-not-allowed' : 'hover:bg-[#363636] hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#66ABFF]'}
              `}
              tabIndex={isLocked ? -1 : 0}
              aria-label={step}
              disabled={isLocked}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSection({ title, stepLabel, children, sectionRef }: { title: string; stepLabel?: string; children: React.ReactNode; sectionRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section ref={sectionRef} className="w-full max-w-7xl min-h-[70vh] flex flex-col justify-center py-4 sm:py-8 scroll-mt-20 sm:scroll-mt-40 ml-0 px-4 sm:px-8 md:px-16">
      {stepLabel && <div className="text-[#B0B3B8] text-sm sm:text-lg font-power-grotesk mb-3 sm:mb-4 text-left">{stepLabel}</div>}
      <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-8 font-power-grotesk text-white text-left" style={{ fontSize: 'clamp(20px, 4vw, 32px)' }}>{title}</h2>
      {children}
    </section>
  );
}

function LoadingDNA({ onComplete, progressOverride }: { onComplete?: () => void; progressOverride?: number }) {
  const [progress, setProgress] = useState(progressOverride ?? 0);
  useEffect(() => {
    if (progressOverride !== undefined) {
      setProgress(progressOverride);
      return;
    }
    if (progress < 100) {
      const timeout = setTimeout(() => setProgress(progress + 1), 200);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete, progressOverride]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-4">
      <div className="relative flex items-center justify-center w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] mx-auto">
        {/* Crescent background */}
        <img 
          src="/crescent.png" 
          alt="Crescent" 
          className="w-full h-full object-contain absolute"
        />
        {/* Logging image inside */}
        <img 
          src="/logging.png" 
          alt="Logging" 
          className="w-full h-full object-contain absolute"
        />
      </div>
      <div className="mt-4 sm:mt-8 text-[#66ABFF] text-base sm:text-lg md:text-xl font-bold font-power-grotesk">{Math.min(progress, 100)}%</div>
      <div className="mt-4 sm:mt-8 text-[#D9D9D9] text-center max-w-2xl mx-auto font-inter px-2 sm:px-4" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
        YOUR DNA WILL BE READY IN A FEW MINUTES. WE&apos;LL INFORM YOU ONCE IT&apos;S READY. YOU CAN USE THE STUDIO MEANWHILE
      </div>
    </div>
  );
}

const initialCreator: Creator = {
  name: '',
  dnaVisibility: 'public',
  price: '9.99',
  license: 'distribution',
  tracks: 'visible',
  partner: 'no',
};

export default function DNACreationPage() {
  const sectionRefs = steps.map(() => useRef<HTMLDivElement>(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [step3Done, setStep3Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [sensitivity, setSensitivity] = useState(5);
  // Step 1: File upload state
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(f => f.type.startsWith('audio/'));
    setAudioFiles(prev => [...prev, ...validFiles]);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };
  const handleRemoveFile = (idx: number) => {
    setAudioFiles(files => files.filter((_, i) => i !== idx));
  };
  // Scroll to section when progress bar button is clicked
  const handleStepClick = (idx: number) => {
    sectionRefs[idx].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.map(ref => ref.current?.getBoundingClientRect().top ?? Infinity);
      let minDiff = Infinity;
      let activeIdx = 0;
      for (let i = 0; i < offsets.length; i++) {
        const diff = Math.abs(offsets[i]);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = i;
        }
      }
      setCurrentStep(activeIdx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  // Step 3: handle Done to auto-advance
  const handleStep3Done = () => {
    setStep3Done(true);
    setCurrentStep(3);
    setTimeout(() => sectionRefs[3].current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  const [step4LoadingDone, setStep4LoadingDone] = useState(false);
  const handleLoadingComplete = () => {
    setStep4LoadingDone(true);
    setCurrentStep(4);
    setTimeout(() => sectionRefs[4].current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  // Scroll to Step 5 when currentStep becomes 4
  useEffect(() => {
    if (currentStep === 4 && sectionRefs[4]?.current) {
      sectionRefs[4].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep, sectionRefs]);

  const handleSetSensitivity = () => {
    setStep2Done(true);
    setCurrentStep(2);
    setTimeout(() => sectionRefs[2].current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  const handleSkipSensitivity = () => {
    setStep2Done(true);
    setCurrentStep(2);
    setTimeout(() => sectionRefs[2].current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  // Step 5: Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const handlePublish = () => setShowPublishModal(true);
  const handleConfirmPublish = () => {
    setShowPublishModal(false);
    setPublishSuccess(true);
    // Optionally, trigger a real publish action here
  };
  const handleCancelPublish = () => setShowPublishModal(false);

  // Add at the top of DNACreationPage
  const [creatorInput, setCreatorInput] = useState('');
  const [creator, setCreator] = useState<Creator>(initialCreator);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="flex min-h-screen bg-[#121314]">
      {/* Sidebar: always fixed, always visible */}
      <Sidebar />
      {/* Main content: margin-left for sidebar, fills rest of screen */}
      <div className="flex-1 min-h-screen ml-0 md:ml-16">
        {/* Top section: full width, sticky, with your custom colors/gradient */}
        <div className="sticky top-0 z-30 w-full pl-4 md:pl-16 border-b border-[#232428] shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]"
          style={{background: 'linear-gradient(90deg, #2a2a2a 0%, #233a50 8%, #233a50 20%, #1a1a1a 40%, #181A1B 100%)', height: 'clamp(200px, 25vh, 240px)'}}
        >
          <div className="max-w-[1200px] py-4 md:py-10 px-4 md:px-0 md:pl-8">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-light text-white tracking-tight font-power-grotesk mb-2">Build DNA by Uploading Audio Tracks</h1>
            <p className="text-[#B0B3B8] text-sm sm:text-base md:text-lg font-inter mb-0">You can upload your music, and build your DNA.</p>
          </div>
          <div className="px-4 md:px-0 md:pl-8 pb-4">
            <StepProgressBar currentStep={currentStep} onStepClick={handleStepClick} step3Done={step3Done} />
          </div>
        </div>
        {/* Main scrollable content: all steps */}
        <div className="w-full flex-1 pl-4 sm:pl-8 md:pl-12 bg-[#0d0d0d]">
          <StepSection title="Upload Audio" stepLabel="Step 1" sectionRef={sectionRefs[0]}>
            <div
              className="rounded-2xl border border-[#44474A] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative ml-0 transition-all w-full max-w-[965px] mx-auto"
              style={{
                minHeight: 'clamp(400px, 60vh, 465px)',
                background: 'linear-gradient(135deg, #181A1C 0%, #0B0C0D 100%)',
                boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)'
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center w-full -mt-8">
                <img src="/copy.png" alt="Copy" className="w-8 h-8 mb-4 opacity-60 sm:w-12 sm:h-12" />
                <div className="text-white text-base sm:text-lg font-power-grotesk font-semibold text-center">Choose audio file(s) or drag them here</div>
                <div className="text-[#B0B3B8] text-xs sm:text-sm font-inter text-center mb-4 sm:mb-6">Supported formats: .mp3, .wav, .aac, .ogg, .flac</div>
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
                <button
                  type="button"
                  className="bg-[#7B3AED] hover:bg-[#5f2fc1] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg font-power-grotesk mb-4 sm:mb-6 w-full sm:w-auto text-sm sm:text-base"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload audio file(s)
                </button>
                {audioFiles.length > 0 && (
                  <div className="w-full mt-4 flex flex-col gap-2">
                    {audioFiles.map((file, idx) => (
                      <div key={file.name + idx} className="flex items-center justify-between bg-[#181A1B] rounded-lg px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">
                        <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          className="ml-2 sm:ml-4 text-red-400 hover:text-red-600 text-lg font-bold hover:scale-110 transition-transform duration-200"
                          onClick={() => handleRemoveFile(idx)}
                          aria-label={`Remove ${file.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-[#B0B3B8] font-inter text-center mt-2">By uploading files, you agree that you have the ownership and authority to upload them.</div>
              </div>
            </div>
          </StepSection>
          <StepSection title="DNA Sensitivity" stepLabel="Step 2" sectionRef={sectionRefs[1]}>
            <div 
              className="rounded-2xl border border-[#44474A] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative ml-0 transition-all w-full max-w-[965px] mx-auto"
              style={{
                minHeight: 'clamp(400px, 60vh, 465px)',
                background: '#0B0B0B',
                boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)'
              }}
            >
              <div className="flex flex-col items-start w-full ml-0 -mt-12">
                <div className="text-white text-lg sm:text-2xl font-power-grotesk font-semibold mb-4">Set the level of sensitivity for the DNA creation</div>
                <div className="text-[#B0B3B8] text-sm sm:text-base font-inter mb-12 sm:mb-20">Less sensitivity will result in less number of DNAs, higher sensitivity will result in many niche DNAs.</div>
                <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
                  <div className="relative w-full sm:w-3/4 mb-4">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={sensitivity}
                      onChange={e => !step2Done && setSensitivity(Number(e.target.value))}
                      className="w-full h-2 bg-[#232428] rounded-lg appearance-none focus:outline-none slider-thumb-green relative z-10"
                      style={{ 
                        accentColor: '#007D49',
                        cursor: 'pointer'
                      }}
                      disabled={step2Done}
                    />
                    <style jsx>{`
                      input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #ffffff;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                        cursor: pointer;
                        border: 2px solid #ffffff;
                      }
                      input[type="range"]::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #ffffff;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                        cursor: pointer;
                        border: 2px solid #ffffff;
                      }
                    `}</style>
                    {/* Tick marks for all 10 points */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-1 pointer-events-none">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                        <div key={tick} className="w-1 h-2 bg-[#44474A] rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between w-full sm:w-3/4 mt-4 text-[#B0B3B8] text-xs sm:text-base font-inter">
                    <div className="flex flex-col items-start -ml-2 sm:-ml-6 -mt-4">
                      <span>Least Sensitive</span>
                      <span className="text-xs sm:text-sm">(Generic Genre DNAs)</span>
                    </div>
                    <div className="text-center text-xs sm:text-base -mt-4">Recommended</div>
                    <div className="flex flex-col items-end -mr-2 sm:-mr-8 -mt-4">
                      <span>Highly Sensitive</span>
                      <span className="text-xs sm:text-sm">(Niche Genre DNAs)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 w-full justify-center">
                  <button
                    className="bg-[#007D49] hover:bg-[#00653a] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg font-power-grotesk text-base sm:text-lg w-full sm:w-auto"
                    onClick={handleSetSensitivity}
                    disabled={step2Done}
                  >
                    Set Sensitivity
                  </button>
                  <button
                    className="border border-white text-white font-power-grotesk text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#232428] hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg w-full sm:w-auto"
                    onClick={handleSkipSensitivity}
                    disabled={step2Done}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </StepSection>
          {step2Done && (
            <StepSection title="Profile Creation" stepLabel="Step 3" sectionRef={sectionRefs[2]}>
              <ProfileCreationForm
                onDone={handleStep3Done}
                disabled={step3Done}
                creator={creator}
                setCreator={setCreator}
                description={description}
                setDescription={setDescription}
                tags={tags}
                setTags={setTags}
              />
            </StepSection>
          )}
          {step3Done && (
            <>
              <StepSection title="Tagging and Categorization" stepLabel="Step 4" sectionRef={sectionRefs[3]}>
                {step3Done && !step4LoadingDone ? (
                  <LoadingDNA onComplete={handleLoadingComplete} />
                ) : step4LoadingDone ? (
                  <LoadingDNA progressOverride={10} />
                ) : null}
              </StepSection>
              <StepSection title="Publish" stepLabel="Step 5" sectionRef={sectionRefs[4]}>
                <div 
                  className="rounded-2xl border border-[#44474A] p-4 sm:p-8 md:p-12 flex flex-col items-start justify-between relative ml-0 transition-all w-full max-w-[965px] mx-auto"
                  style={{
                    minHeight: 'clamp(400px, 60vh, 465px)',
                    background: '#0B0B0B',
                    boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)'
                  }}
                >
                  {!publishSuccess ? (
                    <>
                      <div className="text-lg sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#007D49]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Review Before Publishing
                      </div>
                      <div className="text-[#B0B3B8] mb-4 sm:mb-6 text-left text-sm sm:text-base font-inter">Please review your information below before publishing your DNA profile.</div>
                      <div className="w-full flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-[#66ABFF] font-semibold text-sm sm:text-base">Creator:</span>
                          <span className="text-white text-sm sm:text-base">{creatorInput || (creator && creator.name) || <span className='italic text-[#B0B3B8]'>Not set</span>}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-[#66ABFF] font-semibold text-sm sm:text-base">Description:</span>
                          <span className="text-white text-sm sm:text-base">{description || <span className='italic text-[#B0B3B8]'>Not set</span>}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-[#66ABFF] font-semibold text-sm sm:text-base">Tags:</span>
                          <span className="flex gap-1 sm:gap-2 flex-wrap">{tags.length > 0 ? tags.map(tag => <span key={tag} className="bg-[#232428] text-white rounded-full px-2 sm:px-3 py-1 text-xs font-inter">{tag}</span>) : <span className='italic text-[#B0B3B8]'>None</span>}</span>
                        </div>
                      </div>
                      <div className="w-full flex justify-center">
                        <button
                          className="bg-[#007D49] hover:bg-[#00653a] text-white font-bold text-base sm:text-lg px-6 sm:px-12 py-3 sm:py-4 rounded-full shadow-xl hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg mb-4 sm:mb-8 tracking-wide w-full sm:w-auto"
                          onClick={handlePublish}
                        >
                          <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Publish
                          </span>
                        </button>
                      </div>
                      {/* Confirmation Modal */}
                      {showPublishModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in p-4">
                          <div className="bg-[#181A1B] rounded-2xl p-6 sm:p-10 shadow-2xl flex flex-col items-center border border-[#232428] max-w-md w-full">
                            <div className="text-white text-lg sm:text-2xl font-power-grotesk mb-4 sm:mb-6 font-bold flex items-center gap-2">
                              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#007D49]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Are you sure you want to publish?
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2 w-full">
                              <button
                                className="bg-[#007D49] hover:bg-[#00653a] text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg shadow-md hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg flex items-center justify-center gap-2 flex-1"
                                onClick={handleConfirmPublish}
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Yes
                              </button>
                              <button
                                className="bg-gradient-to-r from-[#ED254E] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#ED254E] text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg shadow-md hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg flex items-center justify-center gap-2 flex-1"
                                onClick={handleCancelPublish}
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                No
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-start justify-center gap-4 sm:gap-6">
                      <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-[#00A06B] animate-bounce" />
                      <div className="text-[#00A06B] text-xl sm:text-3xl font-bold font-power-grotesk text-left">Your DNA has been published! 🎉</div>
                    </div>
                  )}
                </div>
              </StepSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Tailwind animation
// In your global CSS (e.g., globals.css):
// .animate-spin-dna {
//   animation: spin-dna 2s linear infinite;
// }
// @keyframes spin-dna {
//   0% { stroke-dashoffset: 942; }
//   100% { stroke-dashoffset: 235; }
// } 