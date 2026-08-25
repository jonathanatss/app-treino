/**
 * Pure functions extracted from index.html for unit testing.
 * Must stay in sync with the implementations in public/index.html.
 */

/**
 * djb2-XOR hash used to store PINs in localStorage.
 * Source: public/index.html — function hashPin()
 */
export function hashPin(pin) {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = (((h << 5) + h) ^ pin.charCodeAt(i)) >>> 0;
  }
  return String(h);
}

export function profilePinKey(id) {
  return `gym-app-profile-${id}-pin`;
}

export const ACTIVE_KEY = "gym-app-active-profile";
