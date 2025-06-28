import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarIcon = ({ icon, label, active, onClick }: SidebarIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <button
        className={`flex flex-col items-center justify-center w-10 h-8 rounded-lg transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg ${
          active 
            ? 'bg-gradient-to-br from-[#66ABFF] to-[#4A90E2] text-white shadow-lg shadow-[#66ABFF]/25' 
            : 'text-[#B0B3B8] hover:bg-gradient-to-br hover:from-[#232428] hover:to-[#2A2D31] hover:text-white'
        }`}
        aria-label={label}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <span className="sr-only">{label}</span>
      </button>
      
      {/* Beautiful Tooltip */}
      {showTooltip && (
        <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50">
          <div className="relative">
            {/* Tooltip Arrow */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-0 border-r-8 border-t-4 border-b-4 border-transparent border-r-[#1B1B1B]"></div>
            
            {/* Tooltip Content */}
            <div className="bg-[#1B1B1B] text-white px-3 py-2 rounded-lg shadow-xl border border-[#232428] backdrop-blur-sm">
              <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const icons = [
  {
    icon: (
      <img src="/home.png" alt="Home" className="w-5 h-5 object-contain" />
    ),
    label: 'Home',
    active: false,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    label: 'Explore',
    active: false,
  },
  {
    icon: (
      <img src="/image.png" alt="Library" className="w-5 h-5 object-contain mb-2" />
    ),
    label: 'Library',
    active: false,
  },
  {
    icon: (
      <div className="w-12 h-10 bg-[#232428] rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
        <img src="/DNA.png" alt="DNA" className="w-8 h-8 object-contain" />
      </div>
    ),
    label: 'DNA',
    active: false,
    isDNA: true,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  return (
    <>
      {/* Mobile Menu Button - Fixed position to avoid overlapping */}
      <button
        className="md:hidden fixed top-6 left-6 z-50 w-12 h-12 bg-[#000000] rounded-xl flex items-center justify-center border border-[#232428] hover:bg-[#232428] transition-colors duration-200 shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-[84px] z-50 bg-[#000000] flex-col items-center py-4 space-y-3 border-r border-[#232428]/20"
        aria-label="Sidebar"
      >
        {/* Logo at top */}
        <div className="w-[60px] h-[54px] mt-0 ml-[2px] relative flex items-center justify-center">
          {!logoError ? (
            <img
              src="/logo.png"
              alt="Soundverse Logo"
              className="w-full h-full object-contain"
              style={{ width: '60px', height: '54px' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#232428] rounded-lg flex items-center justify-center text-white text-xs font-bold">
              LOGO
            </div>
          )}
        </div>
        
        {/* Plus icon in white circle */}
        <SidebarIcon
          icon={
            <img src="/add.png" alt="Add" className="w-4 h-4 object-contain" />
          }
          label="Add"
          active={false}
        />
        
        {icons.map((item, idx) => (
          <SidebarIcon
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={item.active}
            onClick={item.isDNA ? () => router.push('/') : undefined}
          />
        ))}
      </aside>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Menu */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-72 z-50 bg-[#000000] transform transition-transform duration-300 ease-in-out border-r border-[#232428]/20 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-[#232428]/20">
            <div className="w-[250px] h-[225px] flex items-center justify-center">
              {!logoError ? (
                <img
                  src="/logo2.png"
                  alt="Soundverse Logo"
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-[#232428] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  LOGO
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 bg-[#232428] rounded-lg flex items-center justify-center hover:bg-[#363636] transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 px-6 py-4 space-y-2">
            {/* Add button with text - aligned with other icons */}
            <button className="flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg text-[#B0B3B8] hover:bg-gradient-to-r hover:from-[#232428] hover:to-[#2A2D31] hover:text-white">
              <div className="w-10 h-8 bg-[#232428] rounded-lg flex items-center justify-center">
                <img src="/add.png" alt="Add" className="w-4 h-4 object-contain" />
              </div>
              <span className="text-lg font-medium">Add</span>
            </button>
            
            {icons.map((item, idx) => (
              <button
                key={item.label}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                  item.active 
                    ? 'bg-gradient-to-r from-[#66ABFF] to-[#4A90E2] text-white shadow-lg shadow-[#66ABFF]/25' 
                    : 'text-[#B0B3B8] hover:bg-gradient-to-r hover:from-[#232428] hover:to-[#2A2D31] hover:text-white'
                }`}
                onClick={() => {
                  if (item.isDNA) router.push('/');
                  setMobileMenuOpen(false);
                }}
              >
                <div className="w-10 h-8 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
} 