'use client';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import styles from './legal.module.css';

export default function TermsPage() {
  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <NavBar />
        </div>
      </div>
      <div className="container">
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.lastUpdated}>Last Updated: October 31, 2025</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
              By accessing and using Convertic.ai ("Service"), you accept and agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Description of Service</h2>
            <p className={styles.text}>
              Convertic.ai provides AI-powered email marketing software that enables users to create, send, and manage 
              interactive AMP emails. Our Service includes email templates, AI generation tools, analytics, and related features.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Accounts</h2>
            <p className={styles.text}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities 
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Acceptable Use</h2>
            <p className={styles.text}>You agree not to use the Service to:</p>
            <ul className={styles.list}>
              <li>Send spam or unsolicited commercial emails</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or harmful content</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Pricing and Payment</h2>
            <p className={styles.text}>
              Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except 
              as required by law. We reserve the right to change our pricing with 30 days notice.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Intellectual Property</h2>
            <p className={styles.text}>
              All content, features, and functionality of the Service are owned by Convertic.ai and are protected by 
              international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
            <p className={styles.text}>
              Convertic.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use or inability to use the Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Termination</h2>
            <p className={styles.text}>
              We reserve the right to suspend or terminate your account at any time for violation of these Terms. 
              You may cancel your subscription at any time through your account settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
            <p className={styles.text}>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes 
              via email or through the Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Information</h2>
            <p className={styles.text}>
              For questions about these Terms, please contact us at: <a href="mailto:contact@convertic.ai">contact@convertic.ai</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
