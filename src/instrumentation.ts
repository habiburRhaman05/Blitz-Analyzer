// Next.js's own hook, runs once per runtime on boot. Loads the matching
// Sentry config for whichever runtime is actually starting.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
