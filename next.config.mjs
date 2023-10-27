await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["img.clerk.com"],
    },
}

export default nextConfig;
