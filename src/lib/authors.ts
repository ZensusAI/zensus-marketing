export interface Author {
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  url?: string;
  /** Stable Person @id referenced by BlogPosting JSON-LD. Must match the
      author's anchor on /about so the visible byline and the structured
      data always credit the same human. */
  personId: string;
  jobTitle: string;
  sameAs: string[];
}

export const authors = {
  ajin: {
    name: "Ajin Sunny",
    position: "Founder & CEO, Zensus",
    avatar: "/authors/ajin.svg",
    bio: "Ajin writes about cash flow forecasting, financial planning, and how AI changes the way businesses run finance.",
    url: "/about",
    personId: "https://zensus.app/about#ajin-sunny",
    jobTitle: "Founder & CEO",
    sameAs: [
      "https://www.linkedin.com/in/ajinsunny/",
      "https://ajinsunny.com",
    ],
  },
  ashwin: {
    name: "Ashwin Menon",
    position: "Software Developer, Zensus",
    avatar: "/authors/ashwin.svg",
    url: "/about",
    personId: "https://zensus.app/about#ashwin-menon",
    jobTitle: "Software Developer",
    sameAs: ["https://www.linkedin.com/in/ashwinmenon502/"],
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
