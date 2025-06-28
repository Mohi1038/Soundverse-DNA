import Sidebar from '../components/Sidebar';
import DNASection from '../components/DNASection';
import StepSection from '../components/StepSection';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMenuAction = (action: string) => {
    console.log(`Menu action: ${action}`);
    // Add your menu action logic here
    switch(action) {
      case 'profile':
        // Handle profile action
        break;
      case 'settings':
        // Handle settings action
        break;
      case 'logout':
        // Handle logout action
        break;
    }
  };
  
  return (
    <div className="flex h-screen bg-[#18191B]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-16">
        {/* BUILD DNA TOGETHER Section with Profile */}
        <div className="w-full md:pl-16 border-b border-[#232428] shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] relative" style={{background: 'linear-gradient(90deg, #233a50 0%, #233a50 12%, #181A1B 100%)'}}>
          {/* Profile at top right corner */}
          <div className="absolute top-4 right-4 md:right-8 z-10">
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#66ABFF] to-[#4A90E2] flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Invisible hover area that extends down */}
              {isHovered && (
                <div className="absolute right-0 top-10 w-48 h-32 bg-transparent"></div>
              )}
              
              {/* Hover Menu with animations */}
              {isHovered && (
                <div className="absolute right-0 top-10 w-48 bg-[#1B1B1B] border border-[#232428] rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] hover:scale-105 hover:translate-x-1 transition-all duration-200 ease-out transform hover:shadow-lg"
                      onClick={() => handleMenuAction('profile')}
                    >
                      Profile
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] hover:scale-105 hover:translate-x-1 transition-all duration-200 ease-out transform hover:shadow-lg"
                      onClick={() => handleMenuAction('settings')}
                    >
                      Settings
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] hover:scale-105 hover:translate-x-1 transition-all duration-200 ease-out transform hover:shadow-lg"
                      onClick={() => handleMenuAction('logout')}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="max-w-[1200px] mx-auto py-8 md:py-16 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight font-['Power_Grotesk_Variable'] mb-2">
              BUILD DNA
            </h1>
            <p className="text-[#B0B3B8] text-sm md:text-base lg:text-lg font-['Power_Grotesk_Variable'] mb-0">
              Build a DNA on Soundverse and earn passive income as your DNA is used by other creators.{' '}
              <span className="text-white underline cursor-pointer">Learn more</span>
            </p>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pl-16 bg-[#0d0d0d]">
          <DNASection />
          <div className="h-8" />
          <StepSection />
        </main>
      </div>
    </div>
  );
} 