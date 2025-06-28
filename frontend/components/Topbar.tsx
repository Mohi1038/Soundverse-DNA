import { useState } from 'react';

export default function Topbar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="flex justify-end items-center h-16 px-8 bg-transparent relative">
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
        
        {/* Hover Menu */}
        {isHovered && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1B1B1B] border border-[#232428] rounded-lg shadow-xl z-50">
            <div className="py-2">
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] transition-colors duration-200">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] transition-colors duration-200">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-white hover:bg-[#232428] transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 