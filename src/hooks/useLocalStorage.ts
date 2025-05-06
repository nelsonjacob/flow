import { useCallback } from 'react';

export const useLocalStorage = () => {
  const loadFromStorage = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const savedString = localStorage.getItem(key);
      return savedString ? JSON.parse(savedString) : defaultValue;
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error);
      return defaultValue;
    }
  }, []);

  const saveToStorage = useCallback(<T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error);
    }
  }, []);

  return {
    loadFromStorage,
    saveToStorage,
  };
};
