"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  InteractionsArray, 
  getInteractionsFromCookie, 
  saveInteractionsToCookie, 
  addInteraction 
} from "@/lib/interactions";

/**
 * Hook to manage user interactions array with cookie persistence
 */
export function useInteractions() {
  const [interactions, setInteractions] = useState<InteractionsArray>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load interactions from cookie on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const storedInteractions = getInteractionsFromCookie();
      setInteractions(storedInteractions);
      setIsLoaded(true);
    } catch (error) {
      console.warn("Failed to load interactions:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save interactions to cookie whenever interactions change
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      saveInteractionsToCookie(interactions);
    } catch (error) {
      console.warn("Failed to save interactions:", error);
    }
  }, [interactions, isLoaded]);

  /**
   * Add a new interaction for the given item ID
   */
  const addInteractionToArray = useCallback((itemId: string) => {
    setInteractions(prevInteractions => {
      const updatedInteractions = addInteraction(prevInteractions, itemId);
      return updatedInteractions;
    });
  }, []);

  /**
   * Get the current interactions array
   */
  const getInteractions = useCallback(() => {
    return interactions;
  }, [interactions]);

  /**
   * Clear all interactions (useful for testing or user reset)
   */
  const clearInteractions = useCallback(() => {
    setInteractions([]);
  }, []);

  return {
    interactions,
    addInteraction: addInteractionToArray,
    getInteractions,
    clearInteractions,
    isLoaded,
    count: interactions.length
  };
}
