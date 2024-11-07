import Cookies from 'js-cookie'; // For client-side cookie handling

const API_KEYS = {
  OPENAI: "openai_api_key",
  PERPLEXITY: "perplexity_api_key",
};

// ---- Client-side methods (for use in React components) ----
// Save API Key (Client-side only)
export function saveApiKey(serviceName: keyof typeof API_KEYS, key: string): void {
  const cookieName = API_KEYS[serviceName];
  Cookies.set(cookieName, key, { expires: 365 }); // Store the key in the browser for 365 days
}

// Load API Key (Client-side only)
export function loadApiKey(serviceName: keyof typeof API_KEYS): string | null {
  const cookieName = API_KEYS[serviceName];
  return Cookies.get(cookieName) || null; // Get the value from cookies on client-side
}

// Clear API Key (Client-side only)
export function clearApiKey(serviceName: keyof typeof API_KEYS): void {
  const cookieName = API_KEYS[serviceName];
  Cookies.remove(cookieName); // Remove the API key from cookies
}

// ---- Server-side methods (for use in API routes or server-side components) ----
export function loadApiKeyServer(serviceName: keyof typeof API_KEYS, cookieStore: any): string | null {
  const cookieName = API_KEYS[serviceName];
  const apiKey = cookieStore.get(cookieName)?.value || null; // Get the value from cookies on server-side
  return apiKey;
}
