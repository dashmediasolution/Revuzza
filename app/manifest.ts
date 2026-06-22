import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Revuzza",
    short_name: "Revuzza",
    description:
      "Revuzza - Reviews, ratings, and trusted recommendations.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0892A5",
    lang: "en",
    categories: ["business", "social", "productivity"],
    icons: [
      {
        src: "/images/logo.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
 
  };
}