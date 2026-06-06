export interface Author {
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  url?: string;
}

export const authors = {
  ajin: {
    name: "Ajin Sunny",
    position: "Founder & CEO, Zensus",
    avatar: "/authors/ajin.svg",
    bio: "Ajin writes about cash flow forecasting, financial planning, and how AI changes the way founders run finance.",
    url: "/about",
  },
} as const satisfies Record<string, Author>;

export type AuthorKey = keyof typeof authors;
export const DEFAULT_AUTHOR_KEY: AuthorKey = "ajin";

export function getAuthor(key: string | undefined): Author {
  if (key && key in authors) {
    return authors[key as AuthorKey];
  }
  return authors[DEFAULT_AUTHOR_KEY];
}

export function isValidAuthor(key: string): key is AuthorKey {
  return key in authors;
}
