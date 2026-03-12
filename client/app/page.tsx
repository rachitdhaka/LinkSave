"use client";

import { useState, useMemo, useCallback } from "react";
import { Link as LinkIcon } from "lucide-react";
import type { LinkItem } from "@/app/types";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import BorderContainer from "@/app/components/BorderContainer";
import Divider from "@/app/components/Divider";
import SearchBar from "@/app/components/SearchBar";
import LinkInput from "@/app/components/LinkInput";
import LinkCard from "@/app/components/LinkCard";

export default function Home() {
  const [links, setLinks] = useLocalStorage<LinkItem[]>("linksave-links", []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    const query = searchQuery.toLowerCase();
    return links.filter(
      (link) =>
        link.url.toLowerCase().includes(query) ||
        link.description.toLowerCase().includes(query) ||
        link.category.toLowerCase().includes(query),
    );
  }, [links, searchQuery]);

  const handleAdd = useCallback(
    (item: LinkItem) => {
      setLinks((prev) => [item, ...prev]);
    },
    [setLinks],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setLinks((prev) => prev.filter((link) => link.id !== id));
    },
    [setLinks],
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-lg font-mono font-medium text-white tracking-tight">
            LinkSave
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            save · search · organize
          </p>
        </header>

        <BorderContainer>
          {/* Search */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Divider />

          {/* Input */}
          <LinkInput onAdd={handleAdd} />
        </BorderContainer>

        {/* Links count */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            Links
          </span>
          <span className="text-[10px] font-mono text-neutral-600">
            {filteredLinks.length}
            {searchQuery && ` / ${links.length}`}
          </span>
        </div>

        <Divider />

        {/* Links list */}
        <div className="mt-4 space-y-3">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <LinkCard key={link.id} item={link} onDelete={handleDelete} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <LinkIcon size={20} className="text-neutral-700" />
              <p className="text-sm text-neutral-600 font-mono">
                {searchQuery
                  ? "No links match your search"
                  : "No links saved yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
