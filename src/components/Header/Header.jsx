"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll event to add shadow and background to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Navigate to search page when search button is clicked
  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <Image
              src="/images/logo.png"
              alt="E-Pustakaalay Logo"
              className="logo-image"
              width={45}
              height={45}
            />
            <h1 className="site-title">E-Pustakaalay</h1>
          </Link>
        </div>

        <div className="header-actions">
          <button
            className="search-button"
            onClick={handleSearchClick}
            aria-label="Go to search"
          >
            <Image
              src="/images/Search.png"
              alt="Search"
              className="search-icon"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;