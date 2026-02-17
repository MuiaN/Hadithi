'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface Option {
  id: string;
  title: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>{label}</label>}
      <div
        className="w-full px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer"
        style={{
          backgroundColor: 'var(--color-input)',
          borderColor: 'var(--color-inputBorder)',
          color: 'var(--color-textPrimary)'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.title : placeholder}
        </span>
        <div className="flex items-center ml-2 flex-shrink-0">
          {selectedOption && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-hidden flex flex-col"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-textPrimary)'
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center px-2 rounded bg-[var(--color-backgroundSecondary)]">
              <Search size={14} className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 bg-transparent focus:outline-none text-sm"
                placeholder="Search..."
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--color-textPrimary)' }}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.id}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[var(--color-backgroundSecondary)] flex items-center justify-between"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <span className="truncate">{option.title}</span>
                  {value === option.id && <Check size={14} className="text-[var(--color-primary)] flex-shrink-0 ml-2" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}