import Store from 'electron-store';

const API_KEYS = {
  OPENAI: 'openai_api_key',
  PERPLEXITY: 'perplexity_api_key',
} as const;

export type ApiKey = keyof typeof API_KEYS;
type ApiValue = (typeof API_KEYS)[ApiKey];

const store = new Store<Record<ApiValue, string>>();

export function saveApiKey(serviceName: ApiKey, key: string): void {
  const storeKey = API_KEYS[serviceName];
  store.set(storeKey, key);
}

export function loadApiKey(serviceName: ApiKey): string {
  const storeKey = API_KEYS[serviceName];
  return store.get(storeKey) || '';
}

export function clearApiKey(serviceName: ApiKey): void {
  const storeKey = API_KEYS[serviceName];
  store.delete(storeKey);
}
