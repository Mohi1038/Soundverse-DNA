import React, { useState, useEffect, useRef } from 'react';
import { Creator } from '../types/Creator'; // adjust path if needed

interface ProfileCreationFormProps {
  onDone?: () => void;
  disabled?: boolean;
  creator: Creator;
  setCreator: React.Dispatch<React.SetStateAction<Creator>>;
  description: string;
  setDescription: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
}

const dnaVisibilityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Draft', value: 'draft' },
];
const priceOptions = [
  { label: '$9.99', value: '9.99' },
  { label: '$19.99', value: '19.99' },
  { label: '$29.99', value: '29.99' },
  { label: '$49.99', value: '49.99' },
  { label: '$99.99', value: '99.99' },
];
const licenseOptions = [
  { label: 'Distribution', value: 'distribution' },
  { label: 'Royalty Free', value: 'royalty_free' },
  { label: 'Sample', value: 'sample' },
  { label: 'Sync', value: 'sync' },
  { label: 'Full Ownership', value: 'full_ownership' },
];
const tracksOptions = [
  { label: 'Visible', value: 'visible' },
  { label: 'Invisible', value: 'invisible' },
];
const partnerOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export default function ProfileCreationForm({
  onDone,
  disabled,
  creator,
  setCreator,
  description,
  setDescription,
  tags,
  setTags,
}: ProfileCreationFormProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/dna-artists')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCreators(data))
      .catch(() => setCreators([]));
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCreator({ ...creator, image_url: URL.createObjectURL(file) });
    }
  };

  const handleImageUpload = async () => {
    if (!creator) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', new File([], ''), creator.name);
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/upload-picture', {
      method: 'POST',
      body: formData,
    });
    setUploading(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    console.log({
      creator: creator.name,
      description,
      tags,
      dna_visibility: creator.dnaVisibility,
      price: creator.price,
      license: creator.license,
      tracks: creator.tracks,
      partner: creator.partner,
    });
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/dna-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creator: creator.name,
        description,
        tags,
        dna_visibility: creator.dnaVisibility,
        price: creator.price,
        license: creator.license,
        tracks: creator.tracks,
        partner: creator.partner,
      }),
    });
    setUploading(false);
    if (onDone && !uploading) onDone();
  };

  return (
    <form
      className="bg-[#000000] border border-[#232428] rounded-2xl p-12 flex flex-row min-h-[400px] w-full max-w-7xl mx-auto relative"
      style={{ boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)' }}
      onSubmit={handleSubmit}
    >
      {/* Upload Picture at top-right */}
      <div className="absolute right-12 top-12 flex flex-col items-center z-10">
        <div className="relative flex flex-col items-center">
          <div
            className="w-56 h-56 rounded-full bg-[#232428] flex items-center justify-center border border-[#44474A] mb-4 relative overflow-hidden"
            style={{ boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)' }}
          >
            {creator && (
              <img src={creator.image_url} alt={creator.name} className="w-full h-full object-cover rounded-full" />
            )}
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-[#232428] flex items-center justify-center text-3xl text-[#B0B3B8] border-none focus:outline-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add picture"
            >
              +
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <button
            type="button"
            className="bg-[#232428] hover:bg-[#363636] text-white font-semibold px-8 py-3 rounded-full transition-colors font-grotesk text-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Picture
          </button>
        </div>
      </div>
      {/* Left: Form Fields (take full width except for picture) */}
      <div className="flex-1 flex flex-col gap-4 pr-80">
        {/* Custom Creator Dropdown */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Creator Name</label>
          <div className="relative w-96">
            <input
              className="w-full bg-[#1B1B1B] text-white rounded-full px-6 py-3 font-grotesk text-base focus:outline-none"
              placeholder="Name such as Coldplay or type your own"
              value={creator.name}
              onChange={e => {
                setCreator(prev => ({ ...prev, name: e.target.value }));
              }}
              onFocus={() => setDropdownOpen(true)}
              disabled={disabled}
            />
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-[#181A1B] border border-[#232428] rounded-2xl shadow-lg z-50 max-h-72 overflow-y-auto">
                {creators.length === 0 && (
                  <div className="p-4 text-[#B0B3B8] text-center">No creators found</div>
                )}
                {creators.filter(c => {
                  if (!c) return false;
                  const name = typeof c === "string" ? c : c.name || (c as any).creator;
                  return name.toLowerCase().includes(creator.name.toLowerCase());
                }).map(c => (
                  <button
                    type="button"
                    key={c.id}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[#232428] text-left"
                    onClick={() => {
                      setCreator(prev => ({
                        ...prev,
                        id: c.id,
                        name: c.name || (c as any).creator,
                        image_url: c.image_url,
                        genre: c.genre,
                        description: c.description,
                        audio_preview: c.audio_preview,
                      }));
                      setDropdownOpen(false);
                    }}
                    disabled={disabled}
                  >
                    <img src={c.image_url} alt={c.name || (c as any).creator} className="w-10 h-10 rounded-full object-cover border border-[#232428]" />
                    <div>
                      <div className="font-semibold text-white">{c.name || (c as any).creator}</div>
                      <div className="text-xs text-[#B0B3B8]">{c.genre} &middot; {c.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Description</label>
          <input
            className="flex-1 bg-[#1B1B1B] text-white rounded-full px-6 py-3 font-grotesk text-base focus:outline-none"
            placeholder="Upto 300 characters"
            maxLength={300}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Tags</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#232428] flex items-center justify-center text-xl text-[#B0B3B8] border-none focus:outline-none"
              onClick={handleAddTag}
              aria-label="Add tag"
              disabled={disabled}
            >
              +
            </button>
            <input
              className="bg-[#1B1B1B] text-white rounded-full px-3 py-1 font-grotesk text-sm focus:outline-none w-24"
              placeholder="Add tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
              disabled={disabled}
            />
            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="bg-[#232428] text-white rounded-full px-2 py-0.5 text-xs font-grotesk flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-[#B0B3B8] hover:text-red-400 focus:outline-none"
                    style={{ fontSize: '1rem', lineHeight: 1 }}
                    aria-label={`Remove tag ${tag}`}
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    disabled={disabled}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Dropdowns with descriptions */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">DNA Visibility</label>
          <div className="relative w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 py-2 font-grotesk text-base focus:outline-none appearance-none"
              value={creator.dnaVisibility}
              onChange={e => setCreator(prev => ({ ...prev, dnaVisibility: e.target.value }))}
              disabled={disabled}
            >
              {dnaVisibilityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Price</label>
          <div className="relative w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 py-2 font-grotesk text-base focus:outline-none appearance-none"
              value={creator.price}
              onChange={e => {
                setCreator(prev => ({ ...prev, price: e.target.value }));
              }}
              disabled={disabled}
            >
              {priceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">License</label>
          <div className="relative w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 py-2 font-grotesk text-base focus:outline-none appearance-none"
              value={creator.license}
              onChange={e => {
                setCreator(prev => ({ ...prev, license: e.target.value }));
              }}
              disabled={disabled}
            >
              {licenseOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Tracks</label>
          <div className="relative w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 py-2 font-grotesk text-base focus:outline-none appearance-none"
              value={creator.tracks}
              onChange={e => {
                setCreator(prev => ({ ...prev, tracks: e.target.value }));
              }}
              disabled={disabled}
            >
              {tracksOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-right text-base font-grotesk">Become Partner</label>
          <div className="relative w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 py-2 font-grotesk text-base focus:outline-none appearance-none"
              value={creator.partner}
              onChange={e => {
                setCreator(prev => ({ ...prev, partner: e.target.value }));
              }}
              disabled={disabled}
            >
              {partnerOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        {/* Centered Done button at the bottom */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-[#007D49] hover:bg-[#00653a] text-white font-semibold px-24 py-5 rounded-full transition-colors font-grotesk text-xl shadow-lg ml-64"
            disabled={uploading || disabled}
          >
            {uploading ? 'Uploading...' : 'Done'}
          </button>
        </div>
      </div>
    </form>
  );
} 