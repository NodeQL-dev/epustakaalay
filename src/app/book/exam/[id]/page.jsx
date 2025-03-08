"use client";

import React, { useState, useEffect, use } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';
import Link from 'next/link';
import './book.css';

// For SEO
// export async function generateMetadata({ params }) {
//   const { id } = params;
//   let title = 'Books';
  
//   switch (id?.toLowerCase()) {
//     case 'jee': title = 'JEE Books'; break;
//     case 'cbse': title = 'CBSE Books'; break;
//     case 'neetu': title = 'NEET UG Books'; break;
//     case 'neeta': title = 'NEET All Books'; break;
//     case 'icse': title = 'ICSE Books'; break;
//     case 'gate': title = 'GATE Books'; break;
//     case 'nda': title = 'NDA Books'; break;
//     case 'ssb': title = 'SSB Books'; break;
//     case 'ssc': title = 'SSC Books'; break;
//     case 'cat': title = 'CAT Books'; break;
//     case 'clat': title = 'CLAT Books'; break;
//     case 'openl': title = 'Open Library Books'; break;
//     case 'dgca': title = 'DGCA Books'; break;
//     default: title = 'All Books'; break;
//   }
  
//   return {
//     title,
//     description: `Browse our collection of ${getCategoryTitle(id)} on E-Pustakaalay - your digital library for educational resources.`,
//     openGraph: {
//       title: title,
//       description: `Browse our collection of ${getCategoryTitle(id)} on E-Pustakaalay - your digital library for educational resources.`,
//       type: 'website',
//       url: `https://e-pustakaalay.vercel.app/book/exam/${id}`,
//       images: [
//         {
//           url: 'https://e-pustakaalay.vercel.app/images/og-image.jpg',
//           width: 1200,
//           height: 630,
//           alt: `${getCategoryTitle(id)} - E-Pustakaalay`,
//         },
//       ],
//     },
//   };
// }

// Helper function to get category title from ID
function getCategoryTitle(id) {
  switch (id?.toLowerCase()) {
    case 'jee': return 'JEE Books';
    case 'cbse': return 'CBSE Books';
    case 'neetu': return 'NEET UG Books';
    case 'neeta': return 'NEET All Books';
    case 'icse': return 'ICSE Books';
    case 'gate': return 'GATE Books';
    case 'nda': return 'NDA Books';
    case 'ssb': return 'SSB Books';
    case 'ssc': return 'SSC Books';
    case 'cat': return 'CAT Books';
    case 'clat': return 'CLAT Books';
    case 'openl': return 'Open Library Books';
    case 'dgca': return 'DGCA Books';
    default: return 'All Books';
  }
}

export default function Book({ params: paramsPromise }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(null);
  const params = use(paramsPromise);
  const { id } = params;

  // Mapping from URL id to Firestore Category
  const idToCategoryMap = {
    'jee': 'JEEM-EP',
    'cbse': 'CBSE-EP',
    'neetu': 'NEETU-EP',
    'neeta': 'NEETA-EP',
    'icse': 'ICSE-EP',
    'gate': 'GATE-EP',
    'nda': 'NDA-EP',
    'ssb': 'SSB-EP',
    'ssc': 'SSC-EP',
    'cat': 'CAT-EP',
    'clat': 'CLAT-EP',
    'openl': 'OPENL-EP',
    'dgca': 'DGCA-EP',
    // Add more mappings as needed based on your categories
  };

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      setIsLoading(true);
      try {
        const category = idToCategoryMap[id?.toLowerCase()] || '';
        let querySnapshot;

        // If a category is specified, filter by Category field; otherwise, fetch all books
        if (category) {
          const q = query(collection(db, 'Books'), where('Category', '==', category));
          querySnapshot = await getDocs(q);
        } else {
          querySnapshot = await getDocs(collection(db, 'Books'));
        }

        // Map Firestore documents to book objects
        const fetchedBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooksByCategory();
  }, [id]); // Re-fetch when category ID changes

  const formatTitle = (title) => {
    return title.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className='containerBook'>
      <div className="book-page-container">
        <div className="category-header">
          <div className="category-title">
            <div className="category-line"></div>
            <h2>{getCategoryTitle(id)}</h2>
          </div>
          <p className="books-count">{books.length} books available</p>
        </div>

        {isLoading && (
          <div className="loading-container">
            <div className="circular-loader"></div>
          </div>
        )}

        {!isLoading && books.length === 0 && (
          <div className="no-books-message">
            <h3>No books found for this category.</h3>
            <p>Try exploring other categories or check back later.</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <div className="books-grid">
            {books.map((book) => (
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
                  <h3 className="book-title" style={{ color: book.TxtColor }} title={book.Title}>
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
        )}
      </div>
    </div>
  );
}