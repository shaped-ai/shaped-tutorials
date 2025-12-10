"use client";
import { useState, useEffect } from "react";

const COOKIE_NAME = "movie_app_user_id";

// Base62 alphabet for encoding
const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Converts a number to base62 string
 */
function toBase62(num: number): string {
  if (num === 0) return "0";
  
  let result = "";
  while (num > 0) {
    result = BASE62_ALPHABET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * Generates a random base62 character
 */
function getRandomBase62Char(): string {
  const randomIndex = Math.floor(Math.random() * 62);
  return BASE62_ALPHABET[randomIndex];
}

/**
 * Generates a short userId using timestamp + random characters
 * Format: base62(timestamp) + 4 random base62 chars
 * Example: "k7Bm9xP2a1" (typically 10-12 characters)
 */
function generateUserId(): string {
  // Get current timestamp (milliseconds since epoch)
  const timestamp = Date.now();
  
  // Convert timestamp to base62
  const timestampBase62 = toBase62(timestamp);
  
  // Add 4 random characters for additional uniqueness
  const randomSuffix = Array.from({ length: 4 }, getRandomBase62Char).join("");
  
  return timestampBase62 + randomSuffix;
}

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
 * Hook to get or generate a unique userId for the session
 * Uses cookies to persist the userId across browser sessions and make it accessible server-side
 */
export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Try to get existing userId from cookies
      const storedUserId = getCookie(COOKIE_NAME);
      
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        // Generate new userId if none exists
        const newUserId = generateUserId();
        setCookie(COOKIE_NAME, newUserId);
        setUserId(newUserId);
      }
    } catch (error) {
      // Handle cookie errors (e.g., private browsing mode)
      console.warn("Failed to access cookies, generating temporary userId:", error);
      setUserId(generateUserId());
    }
  }, []);

  return userId;
}
