import type { Category } from "@/app/types";

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function detectCategory(url: string): Category {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }
    if (
      hostname.includes("medium.com") ||
      hostname.includes("dev.to") ||
      hostname.includes("hashnode") ||
      hostname.includes("substack")
    ) {
      return "article";
    }
    if (
      hostname.includes("github.com") ||
      hostname.includes("npmjs.com") ||
      hostname.includes("vercel.com")
    ) {
      return "tool";
    }
    return "general";
  } catch {
    return "other";
  }
}

export function parseYouTubeTimestamp(
  url: string,
): { videoUrl: string; formattedTime: string; seconds: number } | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (!hostname.includes("youtube.com") && !hostname.includes("youtu.be")) {
      return null;
    }

    const tParam = parsed.searchParams.get("t");
    if (!tParam) return null;

    let totalSeconds = 0;

    // Handle "1h2m3s" format
    const hMatch = tParam.match(/(\d+)h/);
    const mMatch = tParam.match(/(\d+)m/);
    const sMatch = tParam.match(/(\d+)s/);

    if (hMatch || mMatch || sMatch) {
      totalSeconds +=
        (hMatch ? parseInt(hMatch[1]) * 3600 : 0) +
        (mMatch ? parseInt(mMatch[1]) * 60 : 0) +
        (sMatch ? parseInt(sMatch[1]) : 0);
    } else {
      // Handle pure seconds format "123"
      totalSeconds = parseInt(tParam, 10);
      if (isNaN(totalSeconds)) return null;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime =
      hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        : `${minutes}:${String(seconds).padStart(2, "0")}`;

    return { videoUrl: url, formattedTime, seconds: totalSeconds };
  } catch {
    return null;
  }
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
