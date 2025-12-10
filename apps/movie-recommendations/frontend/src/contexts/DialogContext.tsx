"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '@/types/movie';

interface DialogContextType {
  openDialog: (movie: Movie) => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  currentMovie: Movie | null;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const openDialog = (movie: Movie) => {
    setCurrentMovie(movie);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentMovie(null);
  };

  const value: DialogContextType = {
    openDialog,
    closeDialog,
    isDialogOpen,
    currentMovie,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
};
