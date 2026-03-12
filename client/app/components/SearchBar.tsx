"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Search size={16} className="text-neutral-500 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search links..."
        className="w-full bg-transparent text-white text-sm placeholder-neutral-600 focus:ring-0 border-none p-0"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-neutral-500 hover:text-white text-xs font-mono transition-colors duration-150"
        >
          ESC
        </button>
      )}
    </div>
  );
}
