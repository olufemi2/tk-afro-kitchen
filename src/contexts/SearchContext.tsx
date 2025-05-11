'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { featuredDishes, MenuItem } from '@/data/sample-menu';
import { frozenItems, FrozenMenuItem } from '@/data/frozen-menu';
import { useRouter } from 'next/navigation';

interface SearchResult {
  menuItems: MenuItem[];
  frozenItems: FrozenMenuItem[];
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  searchResults: SearchResult;
  performSearch: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    menuItems: [],
    frozenItems: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery?.trim()) {
      setSearchResults({ menuItems: [], frozenItems: [] });
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const lowercaseQuery = searchQuery.toLowerCase().trim();

      // Search in menu items with error handling
      const matchedMenuItems = featuredDishes?.filter(item => {
        try {
          return (
            (item.name?.toLowerCase() || '').includes(lowercaseQuery) ||
            (item.description?.toLowerCase() || '').includes(lowercaseQuery) ||
            (item.category?.toLowerCase() || '').includes(lowercaseQuery)
          );
        } catch (error) {
          console.error('Error filtering menu item:', error);
          return false;
        }
      }) || [];

      // Search in frozen items with error handling
      const matchedFrozenItems = frozenItems?.filter(item => {
        try {
          return (
            (item.name?.toLowerCase() || '').includes(lowercaseQuery) ||
            (item.description?.toLowerCase() || '').includes(lowercaseQuery) ||
            (item.category?.toLowerCase() || '').includes(lowercaseQuery)
          );
        } catch (error) {
          console.error('Error filtering frozen item:', error);
          return false;
        }
      }) || [];

      setSearchResults({
        menuItems: matchedMenuItems,
        frozenItems: matchedFrozenItems
      });

      // Navigate to search results page
      if (searchQuery.trim().length > 0) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ menuItems: [], frozenItems: [] });
    } finally {
      setIsSearching(false);
    }
  }, [router]);

  const clearSearch = useCallback(() => {
    try {
      setQuery('');
      setSearchResults({ menuItems: [], frozenItems: [] });
      setIsSearching(false);
    } catch (error) {
      console.error('Error clearing search:', error);
    }
  }, []);

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      searchResults,
      performSearch,
      isSearching,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
