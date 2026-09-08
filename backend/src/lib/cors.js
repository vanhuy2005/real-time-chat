import "dotenv/config";

const localOrigins = ["http://localhost:5173", "http://localhost:5174"];

export function normalizeOrigin(value) {
  if (!value) return null;

  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

export function getAllowedOrigins() {
  const configuredOrigins = [
    process.env.CORS_ORIGIN,
    process.env.CLIENT_URL,
    process.env.RENDER_EXTERNAL_URL,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map(normalizeOrigin)
    .filter(Boolean);

  return process.env.NODE_ENV === "production"
    ? [...new Set(configuredOrigins)]
    : [...new Set([...localOrigins, ...configuredOrigins])];
}