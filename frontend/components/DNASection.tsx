import React from 'react';

const DNASection: React.FC = () => {
  return (
    <section className="font-inter bg-[#000000] rounded-2xl border border-[#232428] w-full max-w-[1200px] min-h-[220px] flex flex-col justify-center p-8 pl-12 mx-0">
      <h2 className="text-2xl font-normal mb-2 text-left font-power-grotesk">Verify your creator identity → Unlock your DNA</h2>
      <p className="text-gray-400 mb-6 text-left font-inter">
        Simply claim your profile, and we'll build your DNA automatically. Are you a creator with music already on Spotify, Youtube etc?
      </p>
      <div className="flex gap-4 flex-col sm:flex-row justify-start">
        <button className="bg-[#007D49] hover:bg-[#00653a] text-white font-semibold px-8 py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg">
          Claim your profile
        </button>
        <button className="bg-[#363636] hover:bg-[#232428] text-white font-semibold px-8 py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg">
          This doesn't apply to me
        </button>
      </div>
    </section>
  );
};

export default DNASection;
