import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // No cacheComponents: Next.js 16 Cache Components hang on Cloudflare Workers
  // (they depend on Node's timer ordering, which workerd doesn't provide).

  // Workers resolve jose's "workerd" export (dist/browser), which Next's file
  // tracing skips because Node uses dist/node. firebase-admin needs it.
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/jose/dist/browser/**"],
  },
  turbopack: {
    // The portal only uses the Firestore web SDK in the browser. Its Node entry
    // (gRPC + protobufjs codegen) can't load on Workers, so SSR gets the web build too.
    resolveAlias: {
      "@firebase/firestore": "./node_modules/@firebase/firestore/dist/index.esm.js",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the Cloudflare bindings from wrangler.jsonc.
initOpenNextCloudflareForDev();
