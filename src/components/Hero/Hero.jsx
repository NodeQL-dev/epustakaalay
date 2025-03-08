"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faBookOpen,
  faMobileAlt,
  faChevronRight,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';

function Hero() {
  const carouselRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark component as client-side rendered
    setIsClient(true);
    
    // Import Bootstrap's JS only when component mounts
    const bootstrapImport = async () => {
      try {
        // Dynamic import of bootstrap
        const bootstrap = await import('bootstrap');
        
        // Initialize carousel with options
        if (carouselRef.current) {
          // Small timeout to ensure React hydration is complete
          setTimeout(() => {
            new bootstrap.Carousel(carouselRef.current, {
              interval: 5000,
              ride: 'carousel',
              wrap: true
            });
          }, 100);
        }
      } catch (err) {
        console.error("Failed to initialize carousel:", err);
      }
    };
    
    bootstrapImport();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay"></div>
      <div 
        ref={carouselRef} 
        id="heroCarousel" 
        className="carousel slide carousel-fade"
        // Only add data attribute for client-side
        {...(isClient ? { 'data-bs-ride': 'carousel' } : {})}
      >
        {/* Carousel Indicators */}
        <div className="carousel-indicators custom-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        </div>

        {/* Carousel Inner */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-image-container">
              <Image
                src="/images/banner1.webp"
                alt="Explore our collection"
                className="carousel-image"
                width={1920} 
                height={1080}
                priority
              />
            </div>
            <div className="carousel-caption custom-caption">
              <h2>Discover Knowledge</h2>
              <p>Access thousands of books for your educational journey</p>
              <div className="caption-buttons">
                <Link href="#features" className="btn-primary">Explore Categories</Link>
                <Link href="#request-book" className="btn-secondary">Request Book</Link>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div className="carousel-image-container">
              <Image
                src="/images/banner2.webp"
                alt="Welcome to E-Pustakaala"
                className="carousel-image"
                width={1920} 
                height={1080}
                priority
              />
            </div>
            <div className="carousel-caption custom-caption">
              <h2>Welcome to E-Pustakaalay</h2>
              <p>Your digital library for academic excellence</p>
              <div className="caption-buttons">
                <Link href="#features" className="btn-primary">Explore Categories</Link>
                <Link href="#request-book" className="btn-secondary">Request Book</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev custom-control" type="button" aria-label="Previous" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="control-icon">
            <FontAwesomeIcon icon={faChevronLeft} />
          </span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next custom-control" type="button" aria-label="Next" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="control-icon">
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Hero Features Preview */}
      <div className="hero-features">
        {/* Features content */}
        <div className="hero-feature">
          <FontAwesomeIcon icon={faBookOpen} className="feature-icon" />
          <div>
            <h3>Vast Collection</h3>
            <p>Access to thousands of educational books</p>
          </div>
        </div>
        <div className="hero-feature">
          <FontAwesomeIcon icon={faMobileAlt} className="feature-icon" />
          <div>
            <h3>Read Anywhere</h3>
            <p>Access on any device, anytime</p>
          </div>
        </div>
        <div className="hero-feature">
          <FontAwesomeIcon icon={faGraduationCap} className="feature-icon" />
          <div>
            <h3>Academic Focus</h3>
            <p>Specialized for students and learners</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;