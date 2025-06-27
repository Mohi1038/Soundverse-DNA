import { useState } from 'react';
import Tooltip from './Tooltip';

interface SidebarIconProps {
  icon: string;
  label: string;
  active?: boolean;
}

export default function SidebarIcon({ icon, label, active }: SidebarIconProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-colors ${active ? 'bg-[#232428]' : 'hover:bg-[#232428]'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-2xl">{icon}</span>
      {hovered && <Tooltip>{label}</Tooltip>}
    </div>
  );
} 