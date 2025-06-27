import ProfileMenu from './ProfileMenu';
import { useState } from 'react';

export default function Topbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex justify-end items-center h-16 px-8 bg-transparent relative">
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
        </button>
        {open && <ProfileMenu />}
      </div>
    </header>
  );
} 