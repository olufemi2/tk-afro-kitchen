'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "Search our menu...", 
  className = "",
  autoSearch = false,
  onSearch
}: SearchBarProps) {
  const { query, setQuery, performSearch, clearSearch } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    try {
      if (autoSearch && debouncedValue) {
        if (onSearch) {
          onSearch(debouncedValue);
        } else {
          performSearch(debouncedValue);
        }
      }
    } catch (error) {
      console.error('Error in search effect:', error);
    }
  }, [debouncedValue, autoSearch, onSearch, performSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setInputValue(value);
      setQuery(value);
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (onSearch) {
        onSearch(inputValue);
      } else {
        performSearch(inputValue);
      }
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  };

  const handleClear = () => {
    try {
      setInputValue('');
      clearSearch();
    } catch (error) {
      console.error('Error clearing search:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="pl-9 pr-9 w-full border-orange-200/20 focus:border-orange-500/30 focus:ring-orange-500/20"
      />
      {inputValue && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
