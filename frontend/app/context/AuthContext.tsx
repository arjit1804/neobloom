'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, usersAPI } from '../lib/api';

// Define types
interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  bio?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await usersAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      
      // Fetch user data
      const userResponse = await usersAPI.getCurrentUser();
      setUser(userResponse.data);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Format the error before throwing it
      let errorMessage: string;
      
      if (error.response?.data?.detail) {
        // If the error has a detail field, use that
        if (Array.isArray(error.response.data.detail)) {
          // If detail is an array of validation errors
          errorMessage = error.response.data.detail.map((e: any) => e.msg || String(e)).join(', ');
        } else {
          errorMessage = String(error.response.data.detail);
        }
      } else if (error.response?.data?.msg) {
        // Some validation errors might use msg field
        errorMessage = String(error.response.data.msg);
      } else if (Array.isArray(error.response?.data)) {
        // Handle array of errors
        errorMessage = error.response.data.map((e: any) => e.msg || String(e)).join(', ');
      } else if (typeof error.response?.data === 'object' && error.response?.data !== null) {
        // Handle object errors
        const errorMessages = Object.values(error.response.data)
          .map(val => String(val))
          .join(', ');
        errorMessage = errorMessages || 'Login failed. Please check your credentials.';
      } else if (typeof error.response?.data === 'string') {
        // If the data is a string, use it directly
        errorMessage = error.response.data;
      } else if (error.message) {
        // Use the error message if available
        errorMessage = String(error.message);
      } else {
        // Fallback error message
        errorMessage = 'Login failed. Please check your credentials.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      await authAPI.register(userData);
      // Note: We don't automatically log in after registration
      // because email verification might be required
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Format the error before throwing it
      let errorMessage: string;
      
      if (error.response?.data?.detail) {
        // If the error has a detail field, use that
        if (Array.isArray(error.response.data.detail)) {
          // If detail is an array of validation errors
          errorMessage = error.response.data.detail.map((e: any) => e.msg || String(e)).join(', ');
        } else {
          errorMessage = String(error.response.data.detail);
        }
      } else if (error.response?.data?.msg) {
        // Some validation errors might use msg field
        errorMessage = String(error.response.data.msg);
      } else if (Array.isArray(error.response?.data)) {
        // Handle array of errors
        errorMessage = error.response.data.map((e: any) => e.msg || String(e)).join(', ');
      } else if (typeof error.response?.data === 'object' && error.response?.data !== null) {
        // Handle object errors
        const errorMessages = Object.values(error.response.data)
          .map(val => String(val))
          .join(', ');
        errorMessage = errorMessages || 'Registration failed. Please try again.';
      } else if (typeof error.response?.data === 'string') {
        // If the data is a string, use it directly
        errorMessage = error.response.data;
      } else if (error.message) {
        // Use the error message if available
        errorMessage = String(error.message);
      } else {
        // Fallback error message
        errorMessage = 'Registration failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await usersAPI.updateProfile(userData);
      setUser(response.data);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      
      // Format the error before throwing it
      let errorMessage: string;
      
      if (error.response?.data?.detail) {
        // If the error has a detail field, use that
        if (Array.isArray(error.response.data.detail)) {
          // If detail is an array of validation errors
          errorMessage = error.response.data.detail.map((e: any) => e.msg || String(e)).join(', ');
        } else {
          errorMessage = String(error.response.data.detail);
        }
      } else if (error.response?.data?.msg) {
        // Some validation errors might use msg field
        errorMessage = String(error.response.data.msg);
      } else if (Array.isArray(error.response?.data)) {
        // Handle array of errors
        errorMessage = error.response.data.map((e: any) => e.msg || String(e)).join(', ');
      } else if (typeof error.response?.data === 'object' && error.response?.data !== null) {
        // Handle object errors
        const errorMessages = Object.values(error.response.data)
          .map(val => String(val))
          .join(', ');
        errorMessage = errorMessages || 'Profile update failed. Please try again.';
      } else if (typeof error.response?.data === 'string') {
        // If the data is a string, use it directly
        errorMessage = error.response.data;
      } else if (error.message) {
        // Use the error message if available
        errorMessage = String(error.message);
      } else {
        // Fallback error message
        errorMessage = 'Profile update failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 