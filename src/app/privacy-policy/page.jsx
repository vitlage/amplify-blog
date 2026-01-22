'use client';
import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import styles from '../terms-and-conditions/legal.module.css';

export default function PrivacyPage() {
  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <NavBar />
        </div>
      </div>
      <div className="container">
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: October 31, 2025</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.text}>We collect information that you provide directly to us, including:</p>
            <ul className={styles.list}>
              <li>Account information (name, email address, password)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Email campaign data and analytics</li>
              <li>Usage data and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p className={styles.text}>We use the information we collect to:</p>
            <ul className={styles.list}>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Information Sharing</h2>
            <p className={styles.text}>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className={styles.list}>
              <li>Service providers who assist in operating our Service</li>
              <li>Analytics partners to understand usage patterns</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <p className={styles.text}>
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Cookies and Tracking</h2>
            <p className={styles.text}>
              We use cookies and similar tracking technologies to collect information about your browsing activities. 
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <p className={styles.text}>You have the right to:</p>
            <ul className={styles.list}>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Data Retention</h2>
            <p className={styles.text}>
              We retain your information for as long as your account is active or as needed to provide you services. 
              We will delete your information upon request, subject to legal obligations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. International Data Transfers</h2>
            <p className={styles.text}>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Children's Privacy</h2>
            <p className={styles.text}>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Changes to Privacy Policy</h2>
            <p className={styles.text}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contact Us</h2>
            <p className={styles.text}>
              If you have questions about this Privacy Policy, please contact us at: <a href="mailto:contact@convertic.ai">contact@convertic.ai</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
