await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    reactStrictMode: true,
    images: {
        domains: ["img.clerk.com"],
    },
}

export default nextConfig;
