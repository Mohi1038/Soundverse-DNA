import ProfileMenu from './ProfileMenu';
import { useState } from 'react';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    console.log('Mouse entered profile area');
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log('Mouse left profile area');
    setIsHovered(false);
  };

  console.log('Topbar render - isHovered:', isHovered, 'isMenuOpen:', isMenuOpen);

  return (
    <header className="flex justify-end items-center h-16 px-8 bg-transparent relative">
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#66ABFF] transition-all duration-300 ease-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#66ABFF] focus:ring-opacity-50"
          onClick={() => {
            console.log('Profile clicked');
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <div className="relative w-full h-full">
            {/* Beautiful gradient profile avatar */}
            <div className="w-full h-full bg-gradient-to-br from-[#66ABFF] to-[#4A90E2] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </button>
        
        {/* Debug info */}
        <div className="absolute top-12 left-0 bg-red-500 text-white text-xs p-1 z-50">
          Hover: {isHovered ? 'Yes' : 'No'} | Click: {isMenuOpen ? 'Yes' : 'No'}
        </div>
        
        {/* Show menu on hover or click */}
        {(isHovered || isMenuOpen) && (
          <div className="absolute right-0 mt-2 z-50">
            <ProfileMenu 
              isOpen={true} 
              onClose={() => {
                console.log('Menu closing');
                setIsMenuOpen(false);
                setIsHovered(false);
              }} 
            />
          </div>
        )}
      </div>
    </header>
  );
} 