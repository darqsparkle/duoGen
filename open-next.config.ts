import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered pages are served from the static assets. Switch to the R2
// incremental cache if pages ever need revalidation.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
