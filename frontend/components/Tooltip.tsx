import React from 'react';

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#232428] text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
    {children}
  </div>
);

export default Tooltip; 
