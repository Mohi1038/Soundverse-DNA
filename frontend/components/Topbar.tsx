import ProfileMenu from './ProfileMenu';
import { useState } from 'react';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="flex justify-end items-center h-16 px-8 bg-transparent relative">
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#66ABFF] transition-all duration-300 ease-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#66ABFF] focus:ring-opacity-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-full">
            <img 
              src="/profile.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
            {/* Hover overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </button>
        
        {/* Show menu on hover or click */}
        {(isHovered || isMenuOpen) && (
          <ProfileMenu 
            isOpen={true} 
            onClose={() => {
              setIsMenuOpen(false);
              setIsHovered(false);
            }} 
          />
        )}
      </div>
    </header>
  );
} 