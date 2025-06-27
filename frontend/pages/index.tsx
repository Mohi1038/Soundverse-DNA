import Sidebar from '../components/Sidebar';
import ProfileMenu from '../components/ProfileMenu';
import DNASection from '../components/DNASection';
import StepSection from '../components/StepSection';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-[#18191B]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-16">
        {/* BUILD DNA TOGETHER Section with Profile */}
        <div className="w-full md:pl-16 border-b border-[#232428] shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] relative" style={{background: 'linear-gradient(90deg, #233a50 0%, #233a50 12%, #181A1B 100%)'}}>
          {/* Profile at top right corner */}
          <div className="absolute top-4 right-4 md:right-8 z-10">
            <div className="relative">
              <button
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white focus:outline-none"
                onClick={() => setProfileOpen((v) => !v)}
              >
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              </button>
              {profileOpen && <ProfileMenu />}
            </div>
          </div>
          
          <div className="max-w-[1200px] mx-auto py-8 md:py-16 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight font-['Power_Grotesk_Variable'] mb-2">BUILD DNA</h1>
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