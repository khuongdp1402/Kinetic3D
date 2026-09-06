import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://kinetic3d-backend:8080";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/tracking`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/policies/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/refund`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Product & Category routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [prodsRes, catsRes] = await Promise.all([
      fetch(`${apiUrl}/api/products`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/api/categories`, { next: { revalidate: 3600 } }),
    ]);

    if (prodsRes.ok) {
      const products = await prodsRes.json();
      if (Array.isArray(products)) {
        products.forEach((p: any) => {
          if (p.id) {
            dynamicRoutes.push({
              url: `${baseUrl}/products/${p.id}`,
              lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        });
      }
    }

    if (catsRes.ok) {
      const categories = await catsRes.json();
      if (Array.isArray(categories)) {
        categories.forEach((c: any) => {
          if (c.slug) {
            dynamicRoutes.push({
              url: `${baseUrl}/categories/${c.slug}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.7,
            });
          }
        });
      }
    }
  } catch (err) {
    // Graceful fallback to static routes if backend fetch fails during build
  }

  return [...staticRoutes, ...dynamicRoutes];
}
