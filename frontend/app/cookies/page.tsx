'use client';

import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">COOKIE POLICY</h1>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <p className="text-gray-700 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose max-w-none text-gray-700">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your 
              web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
            </p>
            <p>
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, 
              while session cookies are deleted as soon as you close your web browser.
            </p>
            
            <h2>2. How NeoBloom Uses Cookies</h2>
            <p>
              When you use and access the Service, we may place a number of cookie files in your web browser.
            </p>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> These are cookies that are required for the operation of our website. They include, 
                for example, cookies that enable you to log into secure areas of our website.
              </li>
              <li>
                <strong>Functionality cookies:</strong> These are used to recognize you when you return to our website. This enables us to 
                personalize our content for you, greet you by name and remember your preferences (for example, your choice of language or region).
              </li>
              <li>
                <strong>Analytical/performance cookies:</strong> They allow us to recognize and count the number of visitors and to see how 
                visitors move around our website when they are using it. This helps us to improve the way our website works, for example, 
                by ensuring that users are finding what they are looking for easily.
              </li>
            </ul>
            
            <h2>3. Types of Cookies We Use</h2>
            <h3>3.1 Strictly Necessary Cookies</h3>
            <p>
              These cookies are essential to provide you with services available through our website and to enable you to use some of its features. 
              Without these cookies, the services that you have asked for cannot be provided, and we only use these cookies to provide you with those services.
            </p>
            
            <h3>3.2 Functionality Cookies</h3>
            <p>
              These cookies allow our website to remember choices you make when you use our website. The purpose of these cookies is to provide 
              you with a more personal experience and to avoid you having to re-enter your preferences every time you visit our website.
            </p>
            
            <h3>3.3 Analytics and Performance Cookies</h3>
            <p>
              These cookies are used to collect information about traffic to our website and how users use our website. The information gathered 
              does not identify any individual visitor. The information is aggregated and anonymous. It includes the number of visitors to our website, 
              the websites that referred them to our website, the pages they visited on our website, what time of day they visited our website, 
              whether they have visited our website before, and other similar information.
            </p>
            <p>
              We use this information to help operate our website more efficiently, to gather broad demographic information and to monitor the 
              level of activity on our website.
            </p>
            
            <h2>4. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver 
              advertisements on and through the Service, and so on.
            </p>
            
            <h2>5. What Are Your Choices Regarding Cookies</h2>
            <p>
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
            </p>
            <p>
              Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, 
              you may not be able to store your preferences, and some of our pages might not display properly.
            </p>
            <ul>
              <li>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://support.google.com/accounts/answer/32050</a></li>
              <li>For the Internet Explorer web browser, please visit this page from Microsoft: <a href="http://support.microsoft.com/kb/278835" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">http://support.microsoft.com/kb/278835</a></li>
              <li>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></li>
              <li>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></li>
            </ul>
            <p>
              For any other web browser, please visit your web browser's official web pages.
            </p>
            
            <h2>6. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
            </p>
            <p>
              You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when 
              they are posted on this page.
            </p>
            
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please <Link href="/contact" className="text-blue-400 hover:underline">contact us</Link>.
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