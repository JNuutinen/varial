const STORAGE_PREFIX = 'varial';

function getStorageKey(name: string): string {
  return `${STORAGE_PREFIX}-${window.location.host}-${name}`;
}

export function getFromStorage(key: string): string | null {
  return window.localStorage.getItem(getStorageKey(key));
}

export function removeFromStorage(key: string): void {
  window.localStorage.removeItem(getStorageKey(key));
}

export function saveToStorage(key: string, value: string): void {
  window.localStorage.setItem(getStorageKey(key), value);
}
