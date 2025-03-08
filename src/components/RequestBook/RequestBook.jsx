"use client";

import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the import path to your firebase config location
import './RequestBook.css';

const RequestBook = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    subject: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Generate random unique ID
  const generateRandomUniqueID = (len = 20) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  // Validate form data before submission
  const validateForm = () => {
    const { firstname, email, subject } = formData;
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    let errorMessage = '';

    if (!firstname.trim()) {
      errorMessage += 'Name is required.\n';
    }
    if (!email.trim()) {
      errorMessage += 'Email is required.\n';
    } else if (!emailPattern.test(email.trim())) {
      errorMessage += 'Email format is invalid.\n';
    }
    if (!subject.trim()) {
      errorMessage += 'Book Detail is required.\n';
    }

    if (errorMessage) {
      alert(errorMessage);
      return false;
    }

    return true;
  };

  // Submit form data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const requestId = generateRandomUniqueID();
      const submissionData = {
        firstName: formData.firstname,
        email: formData.email,
        bookDetail: formData.subject,
        submissionDateTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      };

      // Create a document with a custom ID in the Request collection
      await setDoc(doc(db, "Request", requestId), submissionData);
      
      setSubmitMessage({ type: 'success', text: 'Request sent successfully!' });
      setFormData({ firstname: '', email: '', subject: '' });
    } catch (error) {
      console.error('Error uploading data:', error);
      setSubmitMessage({ type: 'error', text: `Error uploading data: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="request-book" className="request-book-section section">
      <div className="container d-flex flex-column justify-content-center align-items-center requestContainer">
        <div className="form_box">
          <div className="tag_box" style={{ marginBottom: "15px" }}>
            <div className="line"></div>
            <h2 className="box_text">Request Book</h2>
          </div>
          <div className="form-container">
            <form style={{ backgroundColor: "#090909" }} onSubmit={handleSubmit}>
              <label htmlFor="fname" className="label_form">Name</label>
              <input 
                type="text" 
                id="fname" 
                name="firstname" 
                placeholder="Your name..."
                value={formData.firstname}
                onChange={handleChange}
                className="form_input"
              />

              <label htmlFor="Ename" className="label_form">Email</label>
              <input 
                type="text" 
                id="Ename" 
                name="email" 
                placeholder="Your Email..."
                value={formData.email}
                onChange={handleChange}
                className="form_input"
              />

              <label htmlFor="subject" className="label_form">Book Detail</label>
              <textarea 
                id="subject" 
                name="subject" 
                placeholder="Write the detail about the book.."
                style={{ height: "200px" }}
                value={formData.subject}
                onChange={handleChange}
                className="form_textarea"
              ></textarea>
              
              <div className="task_box">
                <input 
                  type="submit" 
                  value={isSubmitting ? "Submitting..." : "Submit"} 
                  disabled={isSubmitting}
                  className="form_button"
                />
                <p style={{ color: "#e0b214", fontWeight: 450 }}>*New Books are updated every week</p>
              </div>
              
              {submitMessage && (
                <div className={`submit-message ${submitMessage.type}`}>
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestBook;