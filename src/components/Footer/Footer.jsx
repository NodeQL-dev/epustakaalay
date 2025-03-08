"use client"; 

import React from 'react';
import Link from 'next/link';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Links data that can be easily expanded
  const mainLinks = [
    { title: 'Mission', path: '/mission' },
    { title: 'About Us', path: '/about' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Terms of Service', path: '/terms' },
  ];

  const resourceLinks = [
    { title: 'FAQ', path: '/faq' },
    { title: 'Send Feedback', path: '/feedback' },
    { title: 'Contact Us', path: '/contact' },
    { title: 'Site Map', path: '/sitemap.xml' },
  ];

  const socialLinks = [
    { icon: 'fab fa-twitter', title: 'Twitter', url: 'https://twitter.com' },
    { icon: 'fab fa-facebook', title: 'Facebook', url: 'https://facebook.com' },
    { icon: 'fab fa-instagram', title: 'Instagram', url: 'https://instagram.com' },
    { icon: 'fab fa-linkedin', title: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  // Map font awesome class names to actual icons
  const iconMap = {
    'fab fa-twitter': faTwitter,
    'fab fa-facebook': faFacebook,
    'fab fa-instagram': faInstagram,
    'fab fa-linkedin': faLinkedin,
    'fab fa-github': faGithub,
    // Add any other icons you're using
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <h2 className="footer-logo">E-Pustakaalay</h2>
          <p className="footer-tagline">Your Digital Library Companion</p>
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={link.title}
                className="social-icon"
              >
                <FontAwesomeIcon icon={iconMap[link.icon]} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section links">
          <h3>Company</h3>
          <ul>
            {mainLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Resources</h3>
          <ul>
            {resourceLinks.map((link, index) => (
              <li key={index}>
                {link.path.includes('.xml') ? 
                  <a href={link.path} rel="sitemap">{link.title}</a> :
                  <Link href={link.path}>{link.title}</Link>
                }
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3>Newsletter</h3>
          <p>Subscribe to receive updates on new books and features</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>&copy; {currentYear} E-Pustakaalay. All rights reserved.</p>
        </div>
        
        <div className="footer-legal">
          <Link href="/privacy">Privacy Policy</Link>
          <span className="divider">·</span>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;