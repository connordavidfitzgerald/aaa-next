import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    experimental: {
        viewTransition: true,
    },
    turbopack: {
        root: path.resolve(__dirname),
    },
    images: {
        qualities: [75, 90],
    },
};

export default nextConfig;
