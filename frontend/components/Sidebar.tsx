import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';

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
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg ${
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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
      </svg>
    ),
    label: 'Home',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
    label: 'Explore',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16M16 4v16" />
      </svg>
    ),
    label: 'Library',
  },
  {
    icon: (
      <span className="relative inline-block text-xs font-bold text-[#A855F7] group-hover:text-[#C084FC] transition-all duration-300">
        <span className="absolute inset-0 bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#A855F7] animate-shimmer opacity-20" style={{backgroundSize:'200% 100%'}} />
        <span className="relative z-10 drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]">DNA</span>
      </span>
    ),
    label: 'DNA',
    isDNA: true,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center border border-[#232428] hover:bg-[#232428] transition-colors duration-200"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-16 z-50 bg-gradient-to-b from-[#000000] to-[#0A0A0A] flex-col items-center py-4 space-y-4 border-r border-[#232428]/20"
        aria-label="Sidebar"
      >
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
        className={`md:hidden fixed left-0 top-0 h-screen w-64 z-50 bg-gradient-to-b from-[#000000] to-[#0A0A0A] transform transition-transform duration-300 ease-in-out border-r border-[#232428]/20 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Sidebar"
      >
        <div className="flex flex-col items-center py-8 space-y-6">
          {icons.map((item, idx) => (
            <button
              key={item.label}
              className={`flex items-center gap-4 w-full px-6 py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
                item.active 
                  ? 'bg-gradient-to-r from-[#66ABFF] to-[#4A90E2] text-white shadow-lg shadow-[#66ABFF]/25' 
                  : 'text-[#B0B3B8] hover:bg-gradient-to-r hover:from-[#232428] hover:to-[#2A2D31] hover:text-white'
              }`}
              onClick={() => {
                if (item.isDNA) router.push('/');
                setMobileMenuOpen(false);
              }}
            >
              <div className="transition-transform duration-300 hover:scale-110">
                {item.icon}
              </div>
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
} 