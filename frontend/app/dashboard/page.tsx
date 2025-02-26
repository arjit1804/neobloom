'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../lib/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  view_count: number;
  like_count: number;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Fetch user's posts
    const fetchPosts = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const response = await postsAPI.getPosts({ author: user?.id });
        setPosts(response.data);
      } catch (err: any) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load your posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [isAuthenticated, user]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard content if authenticated
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-orbitron text-blue-600">DASHBOARD</h1>
        <Link 
          href="/posts/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          NEW POST
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading your posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-blue-200 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
          <Link 
            href="/posts/new" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-blue-200 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <div className="flex space-x-2">
                  <Link 
                    href={`/posts/edit/${post.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        postsAPI.deletePost(post.id)
                          .then(() => {
                            setPosts(posts.filter(p => p.id !== post.id));
                          })
                          .catch(err => {
                            console.error('Failed to delete post:', err);
                            setError('Failed to delete post. Please try again.');
                          });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <span className="mr-4">
                  <span className="text-gray-700">Created:</span> {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="mr-4">
                  <span className="text-gray-700">Views:</span> {post.view_count}
                </span>
                <span>
                  <span className="text-gray-700">Likes:</span> {post.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 