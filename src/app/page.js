"use client";

import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import BookCarousel from '../components/BookCarousel/BookCarousel';
import RequestBook from '../components/RequestBook/RequestBook';
import Loading from '../components/Loading/Loading';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = [
    { id: "jee", title: "JEE", category: "JEEM-EP" },
    { id: "neet", title: "NEET", category: "NEETU-EP" },
    { id: "cbse", title: "CBSE", category: "CBSE-EP" }
  ];

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <>
      <Hero />
      <Features />
      <section className="book-carousels-section">
        {categories.map(cat => (
          <BookCarousel
            key={cat.id}
            title={cat.title}
            category={cat.category}
          />
        ))}
      </section>
      <RequestBook />
    </>
  );
}