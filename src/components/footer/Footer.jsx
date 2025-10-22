'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import JSAlert from 'js-alert'

const Footer = () => {
  const [subscriberEmail, setSubscriberEmail] = useState("");

  const onSubscribe = () => {
    const form = new URLSearchParams({
      api_token: process.env.NEXT_PUBLIC_CONVERTIC_API_TOKEN,
      list_uid: process.env.NEXT_PUBLIC_CONVERTIC_LIST_UID,
      EMAIL: subscriberEmail,
    });

    fetch(`https://app.convertic.ai/public/api/v2/subscribers`, {
      method: "POST",
      body: form,
    })
      .then(response => {
        if (!response.ok) throw new Error('HTTP error: ' + response.status);
        JSAlert.alert("Thank you for subscribing! Stay tuned for the latest updates and exclusive content.");
      })
      .catch(error => {
        JSAlert.alert("Something went wrong. Please try again.");
      })
  }

  return (
    <footer className="footer">
      <div className="row mt-5">
        <div className="col">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="all_faq_header_bold footer_header_title">Let&apos;s start your email-led</h1>
                <h1 className="all_faq_header_bold footer_header_title">growth marketing</h1>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="footer_feedback">
                  <p className="footer_signup_text">Sign up for updates on our latest innovations</p>
                  <div className="footer_feedback_container">
                    <input 
                      className="footer_feedback_input" 
                      type="text" 
                      placeholder="Subscribe to our news" 
                      value={subscriberEmail} 
                      onChange={e => setSubscriberEmail(e.target.value)} 
                    />
                    <button className="footer_contact_button" onClick={onSubscribe}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="footer_contact_info">
                  <a href="mailto:contact@convertic.ai" className="footer_contact_email">contact@convertic.ai</a>
                  <a href="https://x.com/convertic_ai" target="_blank" rel="noopener noreferrer" className="footer_social_link">
                    <FaXTwitter size={20} />
                  </a>
                  <a href="https://www.linkedin.com/company/convertic-ai/" target="_blank" rel="noopener noreferrer" className="footer_social_link">
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer