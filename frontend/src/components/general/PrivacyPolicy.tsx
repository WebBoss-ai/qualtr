import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const PrivacyPolicy = () => {
  const lastUpdatedDate = new Date().toLocaleDateString();

  return (
    <div>
<Navbar/>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white overflow-hidden">
        <div className="bg-[#17B169] py-6 px-8">
          <h1 className="text-3xl font-bold text-white">Qualtr Privacy Policy</h1>
        </div>
        <div className="p-8">
          <p className="text-gray-600 mb-6">Last updated: {lastUpdatedDate}</p>

          <Section title="1. Introduction">
            <p>
              Qualtr ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6">
              <li>Personal information (e.g., name, email address, phone number)</li>
              <li>Business information</li>
              <li>Usage data and analytics</li>
              <li>Communication data between businesses and agencies</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6">
              <li>Provide and maintain our services</li>
              <li>Improve and personalize user experience</li>
              <li>Communicate with you about our services</li>
              <li>Monitor usage of our services</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing and Disclosure">
            <p>
              We may share your information with third parties only in the ways that are described in this Privacy Policy, including:
            </p>
            <ul className="list-disc pl-6">
              <li>With your consent</li>
              <li>To comply with laws</li>
              <li>To protect our rights</li>
              <li>With our trusted service providers and business partners</li>
            </ul>
          </Section>

          <Section title="5. Your Data Protection Rights">
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6">
              <li>The right to access</li>
              <li>The right to rectification</li>
              <li>The right to erasure</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object</li>
            </ul>
          </Section>

          <Section title="6. Security">
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </Section>

          <Section title="7. Changes to This Privacy Policy">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </Section>

          <Section title="8. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <address className="not-italic">
              Email: support@qualtr.com
              <br />
              Address: 456 Indiranagar, Bangalore, Karnataka 560038
            </address>
          </Section>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="text-gray-600">{children}</div>
  </section>
);

export default PrivacyPolicy;
