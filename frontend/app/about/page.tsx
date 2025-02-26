'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">ABOUT NEOBLOOM</h1>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            NeoBloom is a modern blogging platform designed to empower writers, creators, and thinkers to share their ideas with the world. 
            We believe in the power of words to inspire, educate, and connect people across the globe.
          </p>
          <p className="text-gray-700">
            Our mission is to provide a clean, intuitive, and feature-rich platform that puts the focus on content while giving creators 
            the tools they need to reach and engage with their audience.
          </p>
        </div>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong className="text-gray-900">Rich Content Editing:</strong> Create beautiful posts with our intuitive editor.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong className="text-gray-900">Categories & Tags:</strong> Organize your content for better discoverability.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong className="text-gray-900">Engagement Tools:</strong> Connect with readers through comments and likes.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong className="text-gray-900">Analytics:</strong> Understand your audience with built-in analytics.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong className="text-gray-900">Responsive Design:</strong> Your blog looks great on any device.</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            NeoBloom is built by a passionate team of developers, designers, and content creators who believe in the power of 
            sharing ideas. We're constantly working to improve the platform and add new features based on user feedback.
          </p>
          <p className="text-gray-700">
            Have suggestions or want to join our team? We'd love to hear from you!
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/register" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Join NeoBloom Today
          </Link>
          <p className="mt-4 text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 