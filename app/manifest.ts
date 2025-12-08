import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Totally biased",
    short_name: "Totally biased",
    description:
      "A subjective sort app to rank by taste, bias, and gut instinct.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Create New List",
        short_name: "New List",
        description: "Start ranking a new list",
        url: "/",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "View My Lists",
        short_name: "My Lists",
        description: "View your saved ranking lists",
        url: "/lists",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
