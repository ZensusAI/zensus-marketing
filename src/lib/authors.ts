import { SITE_URL } from "@/lib/constants";
export interface Author {
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  /** Where the byline links: a site path, or an absolute URL for an author
      who is not on /about. */
  url?: string;
  /** Stable Person @id referenced by BlogPosting JSON-LD. For people on the
      /about team it is their card's anchor there; never change a published
      one, since engines key the entity on it. */
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
    personId: `${SITE_URL}/about#ajin-sunny`,
    jobTitle: "Founder & CEO",
    sameAs: [
      "https://www.linkedin.com/in/ajinsunny/",
      "https://github.com/ajinsunny",
    ],
  },
  ashwin: {
    name: "Ashwin Menon",
    position: "Software Developer, Zensus",
    avatar: "/authors/ashwin.svg",
    // A freelance developer for Zensus, not on the /about team (22 Oct
    // 2026), so his byline links to his LinkedIn instead.
    url: "https://www.linkedin.com/in/ashwinmenon502/",
    personId: `${SITE_URL}/about#ashwin-menon`,
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
