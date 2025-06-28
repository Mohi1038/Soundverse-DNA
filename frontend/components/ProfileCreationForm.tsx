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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/dna/')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCreators(data))
      .catch(() => setCreators([]));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
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
    // Image upload functionality removed - backend doesn't have upload endpoint
    console.log('Image upload not implemented in backend yet');
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
      user_id: 'user-123', // You can make this dynamic later
      profile_name: creator.name,
      dna_sequence: description, // Using description as dna_sequence for now
      is_active: true,
    });
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/dna-profiles/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'user-123', // You can make this dynamic later
        profile_name: creator.name,
        dna_sequence: description, // Using description as dna_sequence for now
        is_active: true,
      }),
    });
    setUploading(false);
    if (onDone && !uploading) onDone();
  };

  const handleCreatorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreator(prev => ({ ...prev, name: e.target.value }));
    // Only show dropdown if there's text and it's not an exact match
    const hasText = e.target.value.trim().length > 0;
    const exactMatch = creators.some(c => 
      c.name?.toLowerCase() === e.target.value.toLowerCase()
    );
    setDropdownOpen(hasText && !exactMatch);
  };

  const handleCreatorInputFocus = () => {
    const hasText = creator.name.trim().length > 0;
    const exactMatch = creators.some(c => 
      c.name?.toLowerCase() === creator.name.toLowerCase()
    );
    setDropdownOpen(hasText && !exactMatch);
  };

  const handleCreatorInputBlur = () => {
    // Delay closing to allow for clicks on dropdown items
    setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <form
      className="bg-[#000000] border border-[#232428] rounded-2xl p-4 sm:p-8 lg:p-12 flex flex-col lg:flex-row min-h-[400px] w-full max-w-7xl mx-auto relative"
      style={{ boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)' }}
      onSubmit={handleSubmit}
    >
      {/* Upload Picture - Mobile: top, Desktop: top-right */}
      <div className="lg:absolute lg:right-12 lg:top-12 flex flex-col items-center z-10 mb-6 lg:mb-0">
        <div className="relative flex flex-col items-center">
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full bg-[#232428] flex items-center justify-center border border-[#44474A] mb-4 relative overflow-hidden"
            style={{ boxShadow: '0 1px 8px 0 rgba(0,0,0,0.12)' }}
          >
            {creator && (
              <img src={creator.image_url} alt={creator.name} className="w-full h-full object-cover rounded-full" />
            )}
            <button
              type="button"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full bg-[#232428] flex items-center justify-center text-lg sm:text-xl lg:text-3xl text-[#B0B3B8] border-none focus:outline-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200"
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
            className="bg-[#232428] hover:bg-[#363636] text-white font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg font-grotesk text-sm sm:text-base lg:text-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Picture
          </button>
        </div>
      </div>
      
      {/* Form Fields - Mobile: full width, Desktop: left side with padding */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:pr-80">
        {/* Custom Creator Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Creator Name</label>
          <div className="relative w-full sm:w-96" ref={dropdownRef}>
            <input
              ref={inputRef}
              className="w-full bg-[#1B1B1B] text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 font-grotesk text-sm sm:text-base focus:outline-none"
              placeholder="Name such as Coldplay or type your own"
              value={creator.name}
              onChange={handleCreatorInputChange}
              onFocus={handleCreatorInputFocus}
              onBlur={handleCreatorInputBlur}
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
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[#232428] text-left hover:scale-105 transition-transform duration-200"
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
                    <img src={c.image_url} alt={c.name || (c as any).creator} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-[#232428]" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-sm sm:text-base truncate">{c.name || (c as any).creator}</div>
                      <div className="text-xs text-[#B0B3B8] truncate">{c.genre} &middot; {c.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Description</label>
          <input
            className="flex-1 bg-[#1B1B1B] text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 font-grotesk text-sm sm:text-base focus:outline-none"
            placeholder="Upto 300 characters"
            maxLength={300}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={disabled}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Tags</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#232428] flex items-center justify-center text-lg sm:text-xl text-[#B0B3B8] border-none focus:outline-none hover:scale-110 transition-transform duration-200"
              onClick={handleAddTag}
              aria-label="Add tag"
              disabled={disabled}
            >
              +
            </button>
            <input
              className="bg-[#1B1B1B] text-white rounded-full px-2 sm:px-3 py-1 font-grotesk text-xs sm:text-sm focus:outline-none w-20 sm:w-24"
              placeholder="Add tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
              disabled={disabled}
            />
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="bg-[#232428] text-white rounded-full px-1.5 sm:px-2 py-0.5 text-xs font-grotesk flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-[#B0B3B8] hover:text-red-400 focus:outline-none hover:scale-110 transition-transform duration-200"
                    style={{ fontSize: '0.875rem', lineHeight: 1 }}
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">DNA Visibility</label>
          <div className="relative w-full sm:w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-3 sm:px-4 py-2 font-grotesk text-sm sm:text-base focus:outline-none appearance-none"
              value={creator.dnaVisibility}
              onChange={e => setCreator(prev => ({ ...prev, dnaVisibility: e.target.value }))}
              disabled={disabled}
            >
              {dnaVisibilityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Price</label>
          <div className="relative w-full sm:w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-3 sm:px-4 py-2 font-grotesk text-sm sm:text-base focus:outline-none appearance-none"
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
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">License</label>
          <div className="relative w-full sm:w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-3 sm:px-4 py-2 font-grotesk text-sm sm:text-base focus:outline-none appearance-none"
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
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Tracks</label>
          <div className="relative w-full sm:w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-3 sm:px-4 py-2 font-grotesk text-sm sm:text-base focus:outline-none appearance-none"
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
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="w-full sm:w-40 text-left sm:text-right text-sm sm:text-base font-grotesk">Become Partner</label>
          <div className="relative w-full sm:w-72">
            <select
              className="w-full bg-[#1B1B1B] text-white rounded-full px-3 sm:px-4 py-2 font-grotesk text-sm sm:text-base focus:outline-none appearance-none"
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
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B0B3B8]">▼</span>
          </div>
        </div>
        
        {/* Centered Done button at the bottom */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            type="submit"
            className="bg-[#007D49] hover:bg-[#00653a] text-white font-semibold px-8 sm:px-16 lg:px-24 py-3 sm:py-4 lg:py-5 rounded-full hover:scale-105 hover:translate-y-[-2px] transition-all duration-200 ease-out transform hover:shadow-lg font-grotesk text-lg sm:text-xl shadow-lg lg:ml-64"
            disabled={uploading || disabled}
          >
            {uploading ? 'Uploading...' : 'Done'}
          </button>
        </div>
      </div>
    </form>
  );
} 