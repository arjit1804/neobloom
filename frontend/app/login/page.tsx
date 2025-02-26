'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail.map((e: any) => e.msg || String(e)).join(', '));
        } else {
          setError(String(err.response.data.detail));
        }
      } else if (err.response?.data?.msg) {
        setError(String(err.response.data.msg));
      } else if (Array.isArray(err.response?.data)) {
        setError(err.response.data.map((e: any) => e.msg || String(e)).join(', '));
      } else if (typeof err.response?.data === 'object' && err.response?.data !== null) {
        const errorMessages = Object.values(err.response.data)
          .map(val => String(val))
          .join(', ');
        setError(errorMessages || 'Login failed. Please check your credentials.');
      } else if (typeof err.response?.data === 'string') {
        setError(err.response.data);
      } else if (err.message) {
        setError(String(err.message));
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white border border-blue-200 rounded-lg shadow-lg shadow-blue-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-orbitron text-blue-600 mb-2">LOGIN</h1>
          <p className="text-gray-600">Access your NeoBloom account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2 font-mono text-sm">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2 font-mono text-sm">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </div>
          
          <div className="text-center text-gray-600">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
            <div className="mt-4">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 