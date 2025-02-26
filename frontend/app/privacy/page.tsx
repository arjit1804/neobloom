'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">PRIVACY POLICY</h1>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <p className="text-gray-700 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose max-w-none text-gray-700">
            <h2>1. Introduction</h2>
            <p>
              NeoBloom ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our blogging platform.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, 
              understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We may collect information about you in various ways:
            </p>
            <h3>2.1 Personal Data</h3>
            <p>
              When you register for an account, we collect:
            </p>
            <ul>
              <li>Email address</li>
              <li>Name</li>
              <li>Username</li>
              <li>Password (stored in encrypted form)</li>
              <li>Profile information (optional)</li>
            </ul>
            
            <h3>2.2 Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This may include:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited</li>
              <li>Time and date of your visit</li>
              <li>Time spent on pages</li>
              <li>Device information</li>
            </ul>
            
            <h3>2.3 Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            
            <h2>4. Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. 
              We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, 
              and enforce our legal agreements and policies.
            </p>
            
            <h2>5. Data Transfer</h2>
            <p>
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your 
              state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </p>
            <p>
              If you are located outside the United States and choose to provide information to us, please note that we transfer the data, 
              including Personal Data, to the United States and process it there.
            </p>
            
            <h2>6. Disclosure of Data</h2>
            <p>
              We may disclose your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul>
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of NeoBloom</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>Protect the personal safety of users of the Service or the public</li>
              <li>Protect against legal liability</li>
            </ul>
            
            <h2>7. Security of Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of 
              electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, 
              we cannot guarantee its absolute security.
            </p>
            
            <h2>8. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>The right to access, update or delete the information we have on you</li>
              <li>The right of rectification</li>
              <li>The right to object</li>
              <li>The right of restriction</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when 
              they are posted on this page.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
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