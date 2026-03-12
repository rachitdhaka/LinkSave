import type { LinkItem } from "@/app/types";
import { detectCategory } from "@/app/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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

export async function fetchLinks(): Promise<LinkItem[]> {
  const res = await fetch(`${BASE_URL}/api/links`);
  if (!res.ok) throw new Error("Failed to fetch links");
  const json = await res.json();
  return (json.data as BackendLink[]).map(toLinkItem);
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
  if (!res.ok) throw new Error("Failed to save link");
  const json = await res.json();
  return toLinkItem(json.data as BackendLink);
}

export async function deleteLink(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/links/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete link");
}
