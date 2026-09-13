#!/usr/bin/env bash
# Blocking CI security gate. bun audit natively supports per-advisory
# ignores, so no custom allowlist script is needed here (unlike the
# backend, where npm's tooling couldn't cleanly do this).
#
# Every ignored id below is build-tool-chain only (tailwindcss/autoprefixer/
# next's internal CSS pipeline, @sentry's webpack source-map plugin, eslint's
# glob matching): never shipped to the browser or executed by a request.
# Revisit if `bun audit` still reports them after a `bun update`.
set -euo pipefail

bun audit --audit-level=high \
  --ignore=1153171 `# browserslist: unbounded memory growth` \
  --ignore=1153172 `# browserslist: prototype write via untrusted stats json` \
  --ignore=1138811 `# nanoid (postcss's nested copy): negative-size loop` \
  --ignore=1139427 `# nanoid (postcss's nested copy): zero-size loop` \
  --ignore=1153189 `# nanoid (postcss's nested copy): integer overflow` \
  --ignore=1115552 `# picomatch (build glob matching): ReDoS` \
  --ignore=1115554 `# picomatch (build glob matching): ReDoS, second range` \
  --ignore=1124252 `# postcss nested copy: sourceMappingURL file read` \
  --ignore=1139510 `# postcss nested copy: sourceMappingURL path traversal`
