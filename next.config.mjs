import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  immediatelyRender:false
}

// withSentryConfig is a no-op wrapper (adds source-map upload config only)
// until SENTRY_AUTH_TOKEN + org/project are set, safe with no Sentry account.
export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  disableLogger: true,
});
