import { useRouter } from 'next/router';

export default function StepSection() {
  const router = useRouter();
  return (
    <section className="bg-[#000000] rounded-xl p-8 max-w-[1200px] w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-center">Build DNA by Uploading Audio Tracks</h2>
      <p className="text-gray-400 mb-4 text-center">You can upload your music, and build your Sonic DNA. Please note that by default all DNAs remain private.</p>
      <ul className="text-gray-300 mb-6 list-disc list-inside text-center">
        <li><b>Build with AI:</b> With this, AI will take care of captions, categorisations, tags.</li>
        <li><b>Build Manually:</b> You'll have to manually add captions, categorisations and tags.</li>
      </ul>
      <div className="flex justify-center w-full">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors w-full sm:w-auto"
          onClick={() => router.push('/dna/create')}
        >
          Upload audio
        </button>
      </div>
    </section>
  );
} 