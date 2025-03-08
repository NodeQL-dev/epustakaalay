"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import Head from 'next/head';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { db } from '../../../../../firebase'; // Update this path to match your firebase config location
import Script from 'next/script';
import './bookviewer.css';

export default function BookViewer() {
    // State variables
    const [bookData, setBookData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState('Loading...');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [error, setError] = useState(null);

    // References
    const flipbookContainerRef = useRef(null);

    // Hooks for navigation and params
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract parameters from URL
    const { bookTitle, bookId } = params;
    const documentId = params.documentId; // This will be undefined in the new route structure

    // Get params from URL (supports both new route pattern and legacy query params)
    const getUrlParams = () => {
        // First try to get params from the new route structure
        let paramObj = {
            id: bookId, // Cnum
            documentId: documentId, // Firestore document ID
        };

        // Fall back to query string for legacy support
        if (!paramObj.id || !paramObj.documentId) {
            if (!paramObj.id) paramObj.id = searchParams.get('id'); // Legacy Cnum parameter
            if (!paramObj.documentId) paramObj.documentId = searchParams.get('si'); // Legacy document ID parameter
        }

        return paramObj;
    };

    useEffect(() => {
        const params = getUrlParams();
        loadBook(params.documentId, params.id);

        // Add class to body to hide footer
        document.body.classList.add('hide-footer');

        return () => {
            // Remove class when component unmounts
            document.body.classList.remove('hide-footer');
        };
    }, [bookId, documentId, searchParams]);

    // Load book data from Firestore
    const loadBook = async (documentId, cnum) => {
        setIsLoading(true);
        setError(null);

        // First check if we have the document ID
        if (documentId) {
            try {
                // Get the document directly by ID
                const bookDocRef = doc(db, "Books", documentId);
                const bookDocSnap = await getDoc(bookDocRef);

                if (bookDocSnap.exists()) {
                    const fetchedBookData = bookDocSnap.data();
                    fetchedBookData.id = documentId; // Add document ID for reference

                    console.log("Book data retrieved successfully:", fetchedBookData);
                    setBookData(fetchedBookData);

                    // Fetch book description if OCR field exists
                    if (fetchedBookData.OCR) {
                        fetchBookDescription(fetchedBookData.OCR);
                    } else {
                        setDescription("No Description Available");
                    }

                    setIsLoading(false);
                } else {
                    console.error(`No book found with document ID: ${documentId}`);
                    handleNoID();
                }
            } catch (error) {
                console.error("Error fetching book by document ID:", error);
                handleNoID();
            }
        } else if (cnum) {
            // Fall back to query by Cnum if no document ID is available
            try {
                // Try to get the book by Cnum field
                console.log("Document ID not provided, trying to use Cnum instead:", cnum);

                // Try with string Cnum
                let q = query(collection(db, 'Books'), where('Cnum', '==', cnum));
                let querySnapshot = await getDocs(q);

                // If not found, try with numeric Cnum
                if (querySnapshot.empty) {
                    const numericCnum = Number(cnum);
                    if (!isNaN(numericCnum)) {
                        q = query(collection(db, 'Books'), where('Cnum', '==', numericCnum));
                        querySnapshot = await getDocs(q);
                    }
                }

                if (!querySnapshot.empty) {
                    const bookDoc = querySnapshot.docs[0];
                    const fetchedBookData = bookDoc.data();
                    fetchedBookData.id = bookDoc.id;

                    console.log("Book found by Cnum:", fetchedBookData);
                    setBookData(fetchedBookData);

                    if (fetchedBookData.OCR) {
                        fetchBookDescription(fetchedBookData.OCR);
                    } else {
                        setDescription("No Description Available");
                    }

                    setIsLoading(false);
                } else {
                    console.error(`No book found with Cnum: ${cnum}`);
                    handleNoID();
                }
            } catch (error) {
                console.error("Error fetching book by Cnum:", error);
                handleNoID();
            }
        } else {
            console.error("No book ID or document ID provided");
            handleNoID();
        }
    };

    const fetchBookDescription = async (ocr) => {
        if (!ocr) {
            setDescription("No Description Available");
            return;
        }

        try {
            // Set loading state for description
            setDescription("Loading description...");

            // Check if the OCR URL is valid
            if (!ocr.startsWith('http')) {
                throw new Error('Invalid OCR URL');
            }

            // Add a timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const apiUrl = `https://e-pustakaalay.onrender.com/?url=${encodeURIComponent(ocr)}`;

            const response = await fetch(apiUrl, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`API returned error status: ${response.status}`);

                // For 500 errors specifically from render.com service
                if (response.status === 500 && apiUrl.includes('onrender.com')) {
                    // Try to use a fallback or cached description
                    throw new Error('API service may be waking up. Try again in a moment.');
                }

                throw new Error(`API error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success" && data.content) {
                setDescription(data.content);
            } else {
                console.warn("API returned success but no content:", data);
                setDescription("No detailed description available for this book.");
            }
        } catch (error) {
            console.error("Error fetching description:", error);

            // Provide user-friendly error messages
            if (error.name === 'AbortError') {
                setDescription("Description request timed out. The server may be busy.");
            } else if (error.message.includes('waking up')) {
                setDescription("Description service is starting up. Please try again shortly.");
            } else {
                setDescription("Unable to load book description at this time.");
            }
        }
    };

    // Load PDF viewer scripts and initialize
    useEffect(() => {
        // Check for URL field
        const bookUrl = bookData?.URL;

        if (!bookData || !bookUrl || isLoading) return;

        const loadScripts = async () => {
            try {
                // Check if jQuery is already loaded
                if (typeof window !== 'undefined' && !window.jQuery) {
                    await loadScript('/PDF_Flipbook/lib/js/libs/jquery.min.js');
                }

                // Check if flipBook is already loaded
                if (typeof window !== 'undefined' && window.jQuery && !window.jQuery.fn.flipBook) {
                    await loadScript('/PDF_Flipbook/lib/js/flip.js');
                }

                // Initialize PDF viewer
                initializePDFViewer(bookUrl);
            } catch (err) {
                console.error("Error loading scripts:", err);
                setError("Failed to load PDF viewer. Please try again later.");
            }
        };

        loadScripts();
    }, [bookData, isLoading]);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            if (typeof document === 'undefined') return resolve();

            const script = document.createElement('script');
            script.src = src;
            script.async = true;

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

            document.head.appendChild(script);
        });
    };

    const initializePDFViewer = (url) => {
        if (typeof window !== 'undefined' &&
            window.jQuery &&
            window.jQuery.fn.flipBook &&
            flipbookContainerRef.current) {
            const options = {
                height: 2000,
                duration: 700,
                backgroundColor: "#090909",
                webgl: true,
                enableDownload: false,
                soundEnable: false,
                showSearchControl: true,
                useTouch: true
            };

            window.jQuery(flipbookContainerRef.current).flipBook(url, options);

            // Reinitialize the flipbook if necessary
            if (window.dFlip && typeof window.dFlip.init === 'function') {
                window.dFlip.init();
            }
        }
    };

    const handleNoID = () => {
        setIsLoading(false);
        setError("No book selected. Please select a book from the library.");
    };

    const toggleDetails = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };

    // Generate structured data for SEO
    const generateStructuredData = () => {
        if (!bookData) return null;

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Book",
            "name": bookData.Title || "Unknown Title",
            "author": bookData.Author || "Unknown",
            "datePublished": formatDate(bookData.Date),
            "image": bookData.Image,
            "url": bookData.URL,
            "identifier": {
                "@type": "PropertyValue",
                "propertyID": "UID",
                "value": bookData.UID || bookData.id
            },
            "genre": bookData.Category,
            "inLanguage": bookData.Language || "en",
            "accessMode": "textual",
            "accessModeSufficient": "textOnVisual"
        };

        return JSON.stringify(jsonLd);
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split("/");
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <Head>
                {/* Page title and meta data */}
                <title>{bookData ? `${bookData.Title} | E-Pustakaalay` : 'Book Viewer | E-Pustakaalay'}</title>

                {/* Structured data for SEO */}
                {bookData && (
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateStructuredData() }} />
                )}
            </Head>

            <main className="pdfV_container">
                {/* Book Details Sidebar */}
                <div className="container_pdf" id="About_view">
                    <div className="task_box">
                        <img className="logo_main" src="/images/logo.png" alt="E-Pustakaalay Logo" />
                        <h1>E-Pustakaalay</h1>
                    </div>

                    <div className="container-fluid" id="contain">
                        <button
                            id="card-container"
                            onClick={toggleDetails}
                            className="btn-about btn btn-primary"
                            aria-expanded={isDetailsOpen}
                            aria-label="Toggle book details"
                        >
                            Book detail <i className={`fas ${isDetailsOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} id="toggle-icon"></i>
                        </button>

                        <div id="card-info-placeholder">
                            <div id="demo" className={`collapse card ${isDetailsOpen ? 'show' : ''}`}>
                                <div className="dotted-line"></div>
                                <div className="card-header">
                                    <img
                                        className="image_card"
                                        id="card_img1"
                                        src={bookData?.Image || "/images/no-search.png"}
                                        alt={bookData?.Title || "Book cover"}
                                        loading="eager"
                                    />
                                    <h2 className="card-title" id="title-cor1">
                                        {bookData?.Title || "Loading..."}
                                    </h2>
                                </div>
                                <div className="card-body">
                                    <p className="summary-label">Book Summary:</p>
                                    <p className="card-text" id="summary-text">{description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="container_pdf" id="Flipbook_view">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="loading-text">Loading your book...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => router.push('/')}
                            >
                                Return to Home
                            </button>
                        </div>
                    ) : (
                        <div className="col-xs-12" id="flipbookContainer" ref={flipbookContainerRef}>
                            {/* PDF Flipbook will be inserted here by the flipBook plugin */}
                        </div>
                    )}
                </div>

                {/* AI Companion Panel */}
                <div className="container_pdf" id="AI_view">
                    {/* AI companion content will be implemented in the future */}
                </div>
            </main>

            {/* Modal for Book Details */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                contentClassName="dark-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Book Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="card">
                        <div className="card-header text-center">
                            <img
                                className="image_card modal-book-image"
                                src={bookData?.Image || "/images/no-search.png"}
                                alt={bookData?.Title || "Book Cover Page"}
                                loading="eager"
                            />
                            <h2 className="card-title mt-2">{bookData?.Title || "Loading..."}</h2>
                        </div>
                        <div className="card-body">
                            <p className="summary-label fw-bold">Book Summary:</p>
                            <p className="card-text">{description}</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}