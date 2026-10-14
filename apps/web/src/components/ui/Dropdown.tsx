'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: string;
  altText?: string;
}

export default function Dropdown({
  options,
  placeholder,
  value,
  onChange,
  icon,
  altText,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-outline-border rounded-lg bg-white text-sm text-text-primary placeholder:text-text-disabled flex items-center justify-between hover:border-outline-border/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="flex items-center gap-2">
          {icon && <Image width={16.67} height={15} src={icon} alt={altText || 'icon'} />}
          <span className={value ? 'text-text-primary' : 'text-text-disabled'}>{displayValue}</span>
        </div>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-outline-border rounded-lg bg-white shadow-lg z-50">
          <ul className="py-2 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option
                      ? 'text-primary-blue font-medium'
                      : 'text-text-primary hover:bg-muted'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
