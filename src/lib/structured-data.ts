// Helpers for building JSON-LD structured-data blocks.
// Keep these compact and typed so page components can drop a single
// <script type="application/ld+json"> into their Helmet block.

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export const breadcrumbSchema = (crumbs: BreadcrumbCrumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

export const HOME_CRUMB: BreadcrumbCrumb = {
  name: "Home",
  url: "https://zensus.app/",
};
