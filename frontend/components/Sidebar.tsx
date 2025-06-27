import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarIcon = ({ icon, label, active, onClick }: SidebarIconProps) => (
  <button
    className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${active ? 'bg-[#181A1B] text-[#66ABFF]' : 'text-[#B0B3B8] hover:bg-[#181A1B]'}`}
    aria-label={label}
    onClick={onClick}
  >
    {icon}
    <span className="sr-only">{label}</span>
  </button>
);

const icons = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" /></svg>
    ),
    label: 'Home',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
    ),
    label: 'Explore',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><rect x="4" y="4" width="16" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16M16 4v16" /></svg>
    ),
    label: 'Library',
  },
  {
    icon: (
      <span className="relative inline-block text-white text-xs font-bold rounded-full px-3 py-1 overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 animate-shimmer opacity-90" style={{backgroundSize:'200% 100%'}} />
        <span className="relative z-10 text-white drop-shadow-[0_0_12px_rgba(75,85,99,0.9)]">DNA</span>
      </span>
    ),
    label: 'DNA',
    active: true,
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
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center border border-[#232428]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-16 z-50 bg-[#000000] flex-col items-center py-4 space-y-4"
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
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Menu */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-64 z-50 bg-[#000000] transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Sidebar"
      >
        <div className="flex flex-col items-center py-8 space-y-6">
          {icons.map((item, idx) => (
            <button
              key={item.label}
              className={`flex items-center gap-4 w-full px-6 py-3 rounded-lg transition-colors duration-200 ${
                item.active ? 'bg-[#181A1B] text-[#66ABFF]' : 'text-[#B0B3B8] hover:bg-[#181A1B]'
              }`}
              onClick={() => {
                if (item.isDNA) router.push('/');
                setMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
} 