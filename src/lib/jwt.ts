export function parseJwt<T = { exp?: number }>(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    return payload as T
  } catch {
    return null
  }
}

export function isTokenExpiring(token: string | null, bufferSec = 30) {
  if (!token) return true
  const payload = parseJwt<{ exp?: number }>(token)
  if (!payload?.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return payload.exp - bufferSec <= now
}