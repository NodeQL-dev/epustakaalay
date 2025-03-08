"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronRight,
    faChevronLeft
} from '@fortawesome/free-solid-svg-icons';

function Features() {
    const [activeCategory, setActiveCategory] = useState(null);
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const categories = [
        { id: "icse", name: "ICSE", imgSrc: "/images/icse.jpg", disabled: false },
        { id: "cbse", name: "CBSE", imgSrc: "/images/cbse.jpg", disabled: false },
        { id: "jee", name: "JEE", imgSrc: "/images/neet.png", disabled: false },
        { id: "neet", name: "NEET", imgSrc: "/images/neet.png", disabled: false },
        { id: "gate", name: "GATE", imgSrc: "/images/GATE.png", disabled: true },
        { id: "nda", name: "NDA", imgSrc: "/images/nda.jpg", disabled: true },
        { id: "ssb", name: "SSB", imgSrc: "/images/ssb.png", disabled: true },
        { id: "ssc", name: "SSC", imgSrc: "/images/ssc.jpg", disabled: true },
        { id: "cat", name: "CAT", imgSrc: "/images/cat.jpg", disabled: true },
        { id: "clat", name: "CLAT", imgSrc: "/images/clat.jpg", disabled: true },
    ];

    // Function to check scroll position and update arrow visibility
    const checkScrollPosition = () => {
        if (!containerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Add scroll event listener
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            // Check initial state
            checkScrollPosition();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, []);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const handleCategoryHover = (categoryId) => {
        setActiveCategory(categoryId);
    };

    return (
        <section id="features" className="features-section section">
            <div className="container d-flex flex-column justify-content-center align-items-center featuresContainer">
                <div className="features-heading">
                    <h2>Explore Categories</h2>
                    <p>Browse our collection of educational materials by category</p>
                </div>

                <div className="category-wrapper">
                    {showLeftArrow && (
                        <button
                            className="scroll-arrow scroll-left"
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                    )}

                    <div className="category-container" ref={containerRef}>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`category-item ${category.disabled ? "disabled" : ""} ${activeCategory === category.id ? "active" : ""}`}
                                onMouseEnter={() => handleCategoryHover(category.id)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                {category.disabled ? (
                                    // Use regular anchor for disabled items
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        aria-disabled={true}
                                    >
                                        <div className="category-image">
                                            <Image
                                                src={category.imgSrc}
                                                alt={`${category.name} Exam Logo`}
                                                width={70} 
                                                height={70}
                                                loading="lazy"
                                            />
                                        </div>
                                        <p>{category.name}</p>
                                        <span className="coming-soon-tag">Coming Soon</span>
                                    </a>
                                ) : (
                                    // Use Next.js Link for enabled items
                                    <Link
                                        href={`/book/exam/${category.id}`}
                                        aria-disabled={false}
                                        legacyBehavior
                                    >
                                        <a>
                                            <div className="category-image">
                                                <Image
                                                    src={category.imgSrc}
                                                    alt={`${category.name} Exam Logo`}
                                                    width={70}
                                                    height={70}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p>{category.name}</p>
                                            <span className="explore-tag">Explore</span>
                                        </a>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {showRightArrow && (
                        <button
                            className="scroll-arrow scroll-right"
                            onClick={scrollRight}
                            aria-label="Scroll right"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Features;