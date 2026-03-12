"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, Trash2, Play } from "lucide-react";
import type { LinkItem } from "@/app/types";
import { parseYouTubeTimestamp, timeAgo } from "@/app/lib/utils";
import BorderContainer from "./BorderContainer";

interface LinkCardProps {
  item: LinkItem;
  onDelete: (id: string) => void;
}

export default function LinkCard({ item, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const ytTimestamp = parseYouTubeTimestamp(item.url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const displayUrl = (() => {
    try {
      const parsed = new URL(item.url);
      return parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    } catch {
      return item.url;
    }
  })();

  return (
    <BorderContainer className="group hover:border-neutral-700 transition-colors duration-150">
      <div className="px-4 py-3 space-y-2">
        {/* URL row */}
        <div className="flex items-start justify-between gap-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors duration-150 font-mono truncate min-w-0"
          >
            <ExternalLink size={12} className="shrink-0" />
            <span className="truncate">{displayUrl}</span>
          </a>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleCopy}
              className="p-1 text-neutral-600 hover:text-white transition-colors duration-150"
              title="Copy URL"
            >
              {copied ? (
                <Check size={13} className="text-green-400" />
              ) : (
                <Copy size={13} />
              )}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-neutral-600 hover:text-red-400 transition-colors duration-150"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white leading-relaxed">{item.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-neutral-600">
            {timeAgo(item.timestamp)}
          </span>
          <span className="text-[10px] text-neutral-700">·</span>
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
            {item.category}
          </span>

          {ytTimestamp && (
            <>
              <span className="text-[10px] text-neutral-700">·</span>
              <a
                href={ytTimestamp.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-white transition-colors duration-150"
              >
                <Play size={9} />@ {ytTimestamp.formattedTime}
              </a>
            </>
          )}
        </div>
      </div>
    </BorderContainer>
  );
}
