import { useState } from 'react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  console.log('ProfileMenu render - isOpen:', isOpen);

  if (!isOpen) {
    console.log('ProfileMenu not rendering - isOpen is false');
    return null;
  }

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => {
        console.log('Profile clicked');
        onClose();
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => {
        console.log('Settings clicked');
        onClose();
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: () => {
        console.log('Logout clicked');
        onClose();
      }
    }
  ];

  console.log('ProfileMenu rendering menu items');

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-red-500 bg-opacity-20" 
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="absolute right-0 mt-2 w-48 z-50">
        <div className="bg-[#1B1B1B] rounded-xl shadow-2xl border border-[#232428] backdrop-blur-sm overflow-hidden">
          {/* Menu Header */}
          <div className="px-4 py-3 border-b border-[#232428]/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#66ABFF] to-[#4A90E2] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">User Account</p>
                <p className="text-xs text-[#B0B3B8]">user@example.com</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 ease-out transform hover:scale-[1.02] ${
                  hoveredItem === item.id
                    ? 'bg-gradient-to-r from-[#232428] to-[#2A2D31] text-white'
                    : 'text-[#B0B3B8] hover:bg-gradient-to-r hover:from-[#232428] hover:to-[#2A2D31] hover:text-white'
                }`}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className={`transition-all duration-200 ${
                  hoveredItem === item.id ? 'text-[#66ABFF] scale-110' : 'text-[#B0B3B8]'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                
                {/* Hover indicator */}
                {hoveredItem === item.id && (
                  <div className="ml-auto w-1 h-1 bg-[#66ABFF] rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 