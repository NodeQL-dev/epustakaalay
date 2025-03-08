"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './search.css';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState('initial'); // initial, searching, results, no-results
  const [isHovering, setIsHovering] = useState(null);
  const searchCache = useRef(new Map());
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate a unique key for URL parameters
  const generateUniqueKey = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);

  // Fetch books from Firestore
  const fetchBooks = useCallback(async () => {
    if (books) return books;

    setIsLoading(true);
    try {
      const booksCollection = collection(db, 'Books');
      const booksSnapshot = await getDocs(booksCollection);

      const booksData = {};
      booksSnapshot.forEach(doc => {
        const bookData = doc.data();
        booksData[doc.id] = {
          ...bookData,
          id: doc.id,
          Cnum: bookData.Cnum || doc.id
        };
      });

      setBooks(booksData);
      return booksData;
    } catch (error) {
      console.error('Error fetching books:', error);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [books]);

  // Search books with caching
  const searchBooks = useCallback((query, booksData) => {
    const searchKey = query.toLowerCase().trim();

    // Return empty array for short queries
    if (searchKey.length < 2) return [];

    // Use cache if available
    if (searchCache.current.has(searchKey)) {
      return searchCache.current.get(searchKey);
    }

    // Filter books
    const results = Object.values(booksData).filter(book => {
      const titleMatch = book.Title?.toLowerCase().includes(searchKey);
      const authorMatch = book.author?.toLowerCase().includes(searchKey);
      const categoryMatch = book.Category?.toLowerCase().includes(searchKey);
      return titleMatch || authorMatch || categoryMatch;
    });

    // Cache results
    searchCache.current.set(searchKey, results);

    return results;
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId = null;
      return (query) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(async () => {
          setSearchQuery(query);

          if (query.trim().length < 2) {
            setFilteredBooks([]);
            setSearchStatus('initial');
            return;
          }

          setSearchStatus('searching');

          const booksData = books || await fetchBooks();
          const results = searchBooks(query, booksData);

          setFilteredBooks(results);
          setSearchStatus(results.length > 0 ? 'results' : 'no-results');
        }, 300);
      };
    })(),
    [books, fetchBooks, searchBooks]
  );

  // Handle input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  // Restore search context when component mounts
  useEffect(() => {
    const restoreSearchContext = async () => {
      if (typeof window !== 'undefined') {
        const storedContext = sessionStorage.getItem('searchContext');

        if (storedContext) {
          try {
            const context = JSON.parse(storedContext);

            // Restore search query
            setSearchQuery(context.searchQuery || '');

            if (context.searchQuery && context.searchQuery.length >= 2) {
              const booksData = await fetchBooks();
              const results = searchBooks(context.searchQuery, booksData);

              setFilteredBooks(results);
              setSearchStatus(results.length > 0 ? 'results' : 'no-results');

              // Restore scroll position after a short delay
              setTimeout(() => {
                window.scrollTo(0, context.scrollPosition || 0);
              }, 100);
            }

            sessionStorage.removeItem('searchContext');
          } catch (error) {
            console.error('Error parsing search context:', error);
            fetchBooks();
          }
        } else {
          fetchBooks();

          // Check if URL has search query parameter
          const queryParam = searchParams.get('q');

          if (queryParam) {
            setSearchQuery(queryParam);
            debouncedSearch(queryParam);
          }
        }
      }
    };

    restoreSearchContext();
  }, [searchParams, fetchBooks, searchBooks, debouncedSearch]);

  const formatTitle = (title) => {
    return title.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className='containerSearch'>
      <div className="search-page-container">
        <div className="search-section">
          <div className="search_bar">
            <input
              className="search-input"
              type="search"
              placeholder="Search books by title, author, or category"
              value={searchQuery}
              onChange={handleSearchInputChange}
              autoFocus
            />
            <img className="search-icon" src="/images/Search.png" alt="Search" />
          </div>
        </div>

        {isLoading && (
          <div className="loading-container">
            <div className="circular-loader"></div>
          </div>
        )}

        {(searchStatus === 'initial' || searchStatus === 'no-results') && !isLoading && (
          <div className="no-results-container">
            <img
              className="no-search"
              src="/images/no-search.png"
              alt="No Search Results"
            />
            <h2 className="search_text">
              {searchStatus === 'initial'
                ? 'Start typing to search for books'
                : 'No books found matching your search'}
            </h2>
            {searchStatus === 'initial' && (
              <div className="popular-searches">
                <h3>Popular Categories</h3>
                <div className="category-tags">
                  <button
                    className="category-tag"
                    onClick={() => {
                      setSearchQuery('JEE');
                      debouncedSearch('JEE');
                    }}
                  >
                    JEE
                  </button>
                  <button
                    className="category-tag"
                    onClick={() => {
                      setSearchQuery('NEET');
                      debouncedSearch('NEET');
                    }}
                  >
                    NEET
                  </button>
                  <button
                    className="category-tag"
                    onClick={() => {
                      setSearchQuery('CBSE');
                      debouncedSearch('CBSE');
                    }}
                  >
                    CBSE
                  </button>
                  <button
                    className="category-tag"
                    onClick={() => {
                      setSearchQuery('ICSE');
                      debouncedSearch('ICSE');
                    }}
                  >
                    ICSE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {searchStatus === 'results' && !isLoading && (
          <div className="search-results-container">
            <div className="search-results-header">
              <div className="results-indicator">
                <div className="results-indicator-line"></div>
                <h2>Search Results</h2>
              </div>
              <p className="results-count">{filteredBooks.length} books found</p>
            </div>
            <div className="search-results-grid">
              {filteredBooks.map((book) => (
                <div
                  className="book-card"
                  key={book.id}
                  onMouseEnter={() => setIsHovering(book.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{ backgroundColor: book.BgColor }}
                >
                  <div className="book-image-container">
                    <img
                      src={book.Image}
                      alt={book.Title}
                      className="book-image"
                      loading="lazy"
                    />
                    {isHovering === book.id && (
                      <div className="book-overlay">
                        <Link
                          href={`/viewer/book/${formatTitle(book.Title)}/${book.Cnum || book.id}`}
                          className="quick-view-btn"
                        >
                          Quick View
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="book-info">
                    <h3
                      className="book-title"
                      style={{ color: book.TxtColor }}
                      title={book.Title}
                    >
                      {book.Title}
                    </h3>
                    <Link
                      href={`/viewer/book/${formatTitle(book.Title)}/${book.Cnum || book.id}`}
                      className="view-book-btn"
                    >
                      View Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}