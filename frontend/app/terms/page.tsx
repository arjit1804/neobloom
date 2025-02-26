'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">TERMS OF SERVICE</h1>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <p className="text-gray-700 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose max-w-none text-gray-700">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the NeoBloom platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of the terms, you may not access the Service.
            </p>
            
            <h2>2. Description of Service</h2>
            <p>
              NeoBloom provides a blogging platform that allows users to create, publish, share, and manage content. 
              The Service includes all features, content, and related services provided by NeoBloom.
            </p>
            
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. 
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities 
              or actions under your password. You agree not to disclose your password to any third party.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, 
              graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or 
              through the Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content on or through the Service, you represent and warrant that:
            </p>
            <ul>
              <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.</li>
              <li>The posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.</li>
            </ul>
            
            <h2>5. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and 
              will remain the exclusive property of NeoBloom and its licensors. The Service is protected by copyright, 
              trademark, and other laws of both the United States and foreign countries.
            </p>
            
            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, 
              you may simply discontinue using the Service or contact us to request account deletion.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall NeoBloom, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
              for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of 
              profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Service;</li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>Any content obtained from the Service; and</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
            </ul>
            
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 