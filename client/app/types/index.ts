export type Category = "general" | "youtube" | "article" | "tool" | "other";

export interface LinkItem {
  id: string;
  url: string;
  description: string;
  timestamp: string; // ISO string for JSON serialization
  category: Category;
}
