import { eventConfig } from '../eventConfig';
const prefix = `little-wonder:${eventConfig.id}:v1:`;
export function readSaved<T>(key: string, validate: (value: unknown) => value is T): T | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(prefix + key) ?? 'null');
    return validate(value) ? value : null;
  } catch {
    return null;
  }
}
export function saveLocal(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
