export type SharedList = {
  items: string[];
  ranked: boolean;
};

// URL-safe base64 of the UTF-8 JSON payload. Encoding UTF-8 first means any
// character (emoji, CJK, ...) survives; plain btoa() throws above U+00FF.
export function encodeSharedList(list: SharedList): string {
  const bytes = new TextEncoder().encode(JSON.stringify(list));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Returns null when the payload is not a non-empty list of strings.
// Links created before the UTF-8 change were Latin-1 encoded; when the bytes
// are not valid UTF-8 they are read as Latin-1 so those links keep working.
export function decodeSharedList(encoded: string): SharedList | null {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  let json: string;
  try {
    json = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    json = binary;
  }

  const data: unknown = JSON.parse(json);
  if (typeof data !== "object" || data === null) return null;

  const { items, ranked } = data as Record<string, unknown>;
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !items.every((item) => typeof item === "string")
  ) {
    return null;
  }

  return { items, ranked: ranked === true };
}
