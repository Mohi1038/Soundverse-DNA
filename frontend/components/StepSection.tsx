import { useRouter } from 'next/router';

export default function StepSection() {
  const router = useRouter();
  return (
    <section className="bg-[#000000] rounded-2xl border border-[#232428] p-8 pl-12 max-w-[1200px] w-full mx-0 font-inter">
      <h2 className="text-2xl font-normal mb-2 text-left font-power-grotesk">Build DNA by Uploading Audio Tracks</h2>
      <p className="text-gray-400 mb-4 text-left font-inter">You can upload your music, and build your Sonic DNA. Please note that by default all DNAs remain private.</p>
      <ul className="text-gray-300 mb-6 list-disc list-inside text-left font-inter">
        <li><b>Build with AI:</b> With this, AI will take care of captions, categorisations, tags.</li>
        <li><b>Build Manually:</b> You'll have to manually add captions, categorisations and tags.</li>
      </ul>
      <div className="flex justify-start w-full">
        <button
          className="bg-[#007D49] hover:bg-[#00653a] text-white font-semibold px-8 py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg w-full sm:w-auto"
          onClick={() => router.push('/dna/create')}
        >
          Upload audio
        </button>
      </div>
    </section>
  );
} 