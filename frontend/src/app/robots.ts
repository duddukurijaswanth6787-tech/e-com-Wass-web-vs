import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/pos/", "/account/"],
    },
    sitemap: "https://vasanthicreations.in/sitemap.xml",
  };
}
