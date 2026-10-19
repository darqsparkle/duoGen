import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered pages are served from the static assets. Switch to the R2
// incremental cache if pages ever need revalidation.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

// `npm run build` runs the OpenNext build (so Cloudflare's default build
// command works), which in turn runs the plain Next.js build here.
config.buildCommand = "npm run build:next";

export default config;
