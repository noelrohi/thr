await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
}

export default nextConfig;
