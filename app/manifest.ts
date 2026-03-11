import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Ledger",
        short_name: "Ledger",
        description: "A debt tracking application",
        start_url: "/app/",
        display: "standalone",
        background_color: "#F8FAFC",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/icon-256.png",
                sizes: "256x256",
                type: "image/png"
            },
            {
                src: "/icon-348.png",
                sizes: "348x348",
                type: "image/png"
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    }
}