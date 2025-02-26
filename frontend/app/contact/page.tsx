'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate API call
    try {
      // In a real application, you would send this data to your backend
      // await api.post('/contact', formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">CONTACT US</h1>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 mb-8 shadow-sm">
          <p className="text-gray-700 mb-6">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you! 
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-6">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              There was an error sending your message. Please try again later.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105'}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white border border-blue-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Email</h3>
              <p className="text-gray-700">support@neobloom.com</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Social Media</h3>
              <p className="text-gray-700">
                Follow us on Twitter: @NeoBloomHQ
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Office Hours</h3>
              <p className="text-gray-700">Monday - Friday: 9am - 5pm PST</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Response Time</h3>
              <p className="text-gray-700">We aim to respond within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 