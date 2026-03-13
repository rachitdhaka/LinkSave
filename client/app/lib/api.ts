import type { LinkItem } from "@/app/types";
import { detectCategory } from "@/app/lib/utils";

const LINKS_ENDPOINT = "/api/links";
const MAX_ERROR_TEXT_LENGTH = 180;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface BackendLink {
  _id: string;
  url: string;
  description: string;
  createdAt: string;
}

function toLinkItem(doc: BackendLink): LinkItem {
  return {
    id: doc._id,
    url: doc.url,
    description: doc.description,
    timestamp: doc.createdAt,
    category: detectCategory(doc.url),
  };
}

function normalizeErrorText(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "";
  }

  if (/^<!doctype html/i.test(normalized) || /^<html/i.test(normalized)) {
    return "Unexpected HTML response from API";
  }

  if (normalized.length <= MAX_ERROR_TEXT_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_ERROR_TEXT_LENGTH - 3)}...`;
}

async function getErrorMessage(res: Response): Promise<string> {
  const fallback = `${res.status} ${res.statusText}`.trim();
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const json = (await res.json()) as Partial<ApiResponse<unknown>>;
      return json.message ?? json.error ?? fallback;
    } catch {
      return fallback;
    }
  }

  try {
    const text = normalizeErrorText(await res.text());
    return text || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchLinks(): Promise<LinkItem[]> {
  const res = await fetch(LINKS_ENDPOINT, { cache: "no-store" });

  if (!res.ok) {
    const reason = await getErrorMessage(res);
    throw new Error(`Failed to fetch links (${res.status}): ${reason}`);
  }

  const json = (await res.json()) as ApiResponse<BackendLink[]>;
  return json.data.map(toLinkItem);
}

export async function addLink(
  url: string,
  description: string,
): Promise<LinkItem> {
  const res = await fetch(LINKS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, description }),
  });

  if (!res.ok) {
    const reason = await getErrorMessage(res);
    throw new Error(`Failed to save link (${res.status}): ${reason}`);
  }

  const json = (await res.json()) as ApiResponse<BackendLink>;
  return toLinkItem(json.data);
}

export async function deleteLink(id: string): Promise<void> {
  const res = await fetch(`${LINKS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const reason = await getErrorMessage(res);
    throw new Error(`Failed to delete link (${res.status}): ${reason}`);
  }
}
