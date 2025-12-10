/**
 * Utility functions for managing user interactions array
 */

export interface Interaction {
  item_id: string;
}

export type InteractionsArray = Interaction[];

const INTERACTIONS_COOKIE_NAME = "movie_app_interactions";
const MAX_INTERACTIONS = 500;

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set cookie with specified name, value, and options
 */
function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === "undefined") return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get interactions array from cookies
 */
export function getInteractionsFromCookie(): InteractionsArray {
  try {
    const cookieValue = getCookie(INTERACTIONS_COOKIE_NAME);
    if (!cookieValue) return [];
    
    const parsed = JSON.parse(cookieValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to parse interactions cookie:", error);
    return [];
  }
}

/**
 * Save interactions array to cookies
 */
export function saveInteractionsToCookie(interactions: InteractionsArray): void {
  try {
    const serialized = JSON.stringify(interactions);
    setCookie(INTERACTIONS_COOKIE_NAME, serialized);
  } catch (error) {
    console.warn("Failed to save interactions to cookie:", error);
  }
}

/**
 * Add a new interaction to the array with FIFO behavior
 */
export function addInteraction(interactions: InteractionsArray, itemId: string): InteractionsArray {
  const newInteraction: Interaction = { item_id: itemId };
  const updatedInteractions = [...interactions, newInteraction];
  
  // Implement FIFO: remove oldest if we exceed max capacity
  if (updatedInteractions.length > MAX_INTERACTIONS) {
    updatedInteractions.shift(); // Remove first element
  }
  
  return updatedInteractions;
}

/**
 * Get interactions array from server-side cookies (for API routes)
 */
export function getInteractionsFromServerCookie(cookieHeader: string): InteractionsArray {
  try {
    if (!cookieHeader) return [];
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const interactionsValue = cookies[INTERACTIONS_COOKIE_NAME];
    if (!interactionsValue) return [];
    
    const parsed = JSON.parse(decodeURIComponent(interactionsValue));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to parse interactions from server cookie:", error);
    return [];
  }
}
