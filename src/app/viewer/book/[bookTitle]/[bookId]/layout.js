"use client";

import { useParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import Head from 'next/head';

export default function BookViewerLayout({ children }) {
  const params = useParams();
  const { bookTitle } = params;
  
  // Convert hyphens to spaces and capitalize each word for display
  const formattedTitle = bookTitle 
    ? bookTitle.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Book Viewer';
  
  // Hide footer when on book viewer page
  useEffect(() => {
    document.body.classList.add('hide-footer');
    
    return () => {
      document.body.classList.remove('hide-footer');
    };
  }, []);

  return (
    <>
      <Head>
        <title>{formattedTitle} | E-Pustakaalay</title>
        <meta name="description" content={`Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={`${formattedTitle} | E-Pustakaalay`} />
        <meta property="og:description" content={`Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`} />
        <meta property="og:type" content="book" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content={`https://e-pustakaalay.vercel.app/viewer/book/${bookTitle}/${params.bookId}`} />
        
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${formattedTitle} | E-Pustakaalay`} />
        <meta name="twitter:description" content={`Read ${formattedTitle} online on E-Pustakaalay - Your digital library for educational resources`} />
        <meta name="twitter:image" content="/images/og-image.jpg" />
      </Head>
      
      {/* Load required external scripts */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
        strategy="lazyOnload"
      />
      
      {/* Preload jQuery for PDF flipbook */}
      <Script 
        src="/PDF_Flipbook/lib/js/libs/jquery.min.js"
        strategy="beforeInteractive"
        id="jquery-script"
      />
      
      {/* Load custom PDF viewer script */}
      <Script
        src="/PDF_Flipbook/lib/js/flip.js"
        strategy="lazyOnload"
        id="flip-script"
      />
      
      {/* The main content */}
      <div className="book-viewer-layout">
        {children}
      </div>
      
      <style jsx global>{`
        /* Custom styles for book viewer layout */
        html, body {
          overflow: hidden;
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #090909;
        }
        
        /* Hide header and footer on this page */
        body.hide-footer footer,
        body.hide-footer header {
          display: none !important;
        }
        
        /* Fix for iPhone height issue */
        @supports (-webkit-touch-callout: none) {
          .pdfV_container {
            height: -webkit-fill-available;
          }
        }
      `}</style>
    </>
  );
}