'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

interface SearchResult {
  id: number;
  name: string;
  url: string;
  description: string;
  keywords: string[];
}

interface SearchResponse {
  results: SearchResult[];
  count: number;
  query: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const suggestedKeywords = [
  'Anointed',
  'Agunloye',
  'Anointed Agunloye',
  'anointedthedeveloper',
  'Anobyte',
  'anobyte.online',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check saved theme preference only on client
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      setIsDark(shouldBeDark);
      updateTheme(shouldBeDark);
    } catch (error) {
      console.warn('Theme initialization error:', error);
      setIsDark(false);
    }
    setMounted(true);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    updateTheme(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const generateSuggestions = (inputQuery: string) => {
    if (!inputQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = suggestedKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(inputQuery.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();
      setResults(data.results);

      // Log search for analytics
      if (window.gtag) {
        window.gtag('event', 'search', {
          search_term: searchQuery,
          results_count: data.count,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    generateSuggestions(value);
  };

  const handleSearch = () => {
    performSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 font-semibold">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-YOUR_GOOGLE_ANALYTICS_ID`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YOUR_GOOGLE_ANALYTICS_ID');
        `}
      </Script>

      {/* Structured Data JSON-LD for Google */}
      <Script type="application/ld+json" id="structured-data">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Anointed Agunloye',
          alternateName: ['Anointed the developer', 'anointedthedeveloper'],
          url: 'https://anobyte.online',
          image: 'https://anobyte.online/avatar.jpg',
          jobTitle: 'Web Developer',
          sameAs: [
            'https://github.com/anointedthedeveloper',
            'https://anobyte.online',
          ],
          description:
            'Full-stack web developer creating amazing digital experiences',
        })}
      </Script>

      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              anointedthedeveloper
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zm2.828-2.828l1.414-1.414a1 1 0 00-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414zm0 2.828l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 011.414-1.414zM5.586 5.586a1 1 0 01-1.414 0L2.758 3.758a1 1 0 011.414-1.414l1.414 1.414zM7 5a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Anointed Agunloye
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Search for projects, profiles, and online presence
            </p>

            {/* Search Box */}
            <div ref={searchBoxRef} className="relative mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="search"
                    placeholder="Search: Anointed, GitHub, anobyte.online..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    aria-label="Search for Anointed Agunloye"
                  />

                  {/* Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
                    >
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  aria-label="Search"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Quick Keywords */}
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {suggestedKeywords.slice(0, 4).map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleSuggestionClick(keyword)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </section>

          {/* Results Section */}
          <section className="mb-12">
            {results.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Results <span className="text-gray-600 dark:text-gray-400">({results.length})</span>
                </h3>
                <div className="grid gap-4">
                  {results.map((result) => (
                    <article
                      key={result.id}
                      className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 group-hover:underline mb-2">
                          {highlightKeyword(result.name, query)}
                        </h4>
                      </a>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {highlightKeyword(result.description, query)}
                      </p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 break-all"
                      >
                        {result.url}
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {query && results.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  No results found for "{query}"
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  Try searching for "Anointed", "GitHub", or "anobyte"
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Created by{' '}
              <a
                href="https://anobyte.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Anointedthedeveloper
              </a>
            </p>
            <p className="mt-2">
              Find me on{' '}
              <a
                href="https://github.com/anointedthedeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub
              </a>
              {' '}|{' '}
              <a
                href="https://anobyte.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Portfolio
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
