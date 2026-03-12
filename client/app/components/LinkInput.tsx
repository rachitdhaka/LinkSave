"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";
import type { LinkItem } from "@/app/types";
import { isValidUrl, detectCategory } from "@/app/lib/utils";

interface LinkInputProps {
  onAdd: (item: LinkItem) => void;
}

export default function LinkInput({ onAdd }: LinkInputProps) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUrl = url.trim();
    const trimmedDesc = description.trim();

    if (!trimmedUrl) {
      setError("URL is required");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("Enter a valid URL (https://...)");
      return;
    }

    if (!trimmedDesc) {
      setError("Description is required");
      return;
    }

    onAdd({
      id: nanoid(),
      url: trimmedUrl,
      description: trimmedDesc,
      timestamp: new Date().toISOString(),
      category: detectCategory(trimmedUrl),
    });

    setUrl("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
      <div className="space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="Paste URL here..."
          className="w-full bg-transparent text-white text-sm placeholder-neutral-600 border-b border-neutral-800 pb-2 focus:border-neutral-600 transition-colors duration-150"
        />
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
          placeholder="Why are you saving this? (required)"
          rows={2}
          className="w-full bg-transparent text-white text-sm placeholder-neutral-600 border-b border-neutral-800 pb-2 focus:border-neutral-600 transition-colors duration-150 resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      <div className="flex items-center justify-between">
        {url && isValidUrl(url.trim()) && (
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
            {detectCategory(url.trim())}
          </span>
        )}
        <div className="flex-1" />
        <button
          type="submit"
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 py-1.5 transition-colors duration-150"
        >
          <Plus size={12} />
          Save Link
        </button>
      </div>
    </form>
  );
}
