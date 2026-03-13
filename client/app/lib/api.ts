import type { LinkItem } from "@/app/types";
import { detectCategory } from "@/app/lib/utils";

const DEV_API_URL = "http://localhost:5000";

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

  // Normalize common values like https://host.com/ or https://host.com/api.
  if (configured) {
    return configured.replace(/\/+$/, "").replace(/\/api$/, "");
  }

  // Local development should work without manually creating client .env files.
  return process.env.NODE_ENV === "development" ? DEV_API_URL : "";
}

const BASE_URL = getBaseUrl();

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
    const text = (await res.text()).trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchLinks(): Promise<LinkItem[]> {
  const res = await fetch(`${BASE_URL}/api/links`, { cache: "no-store" });

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
  const res = await fetch(`${BASE_URL}/api/links`, {
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
  const res = await fetch(`${BASE_URL}/api/links/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const reason = await getErrorMessage(res);
    throw new Error(`Failed to delete link (${res.status}): ${reason}`);
  }
}
