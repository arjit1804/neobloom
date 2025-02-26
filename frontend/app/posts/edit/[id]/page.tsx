'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { postsAPI, categoriesAPI, tagsAPI } from '../../../lib/api';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  category_id: string;
  tags: Tag[];
  author_id: string;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch post, categories, and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch post, categories, and tags in parallel
        const [postRes, categoriesRes, tagsRes] = await Promise.all([
          postsAPI.getPostById(postId),
          categoriesAPI.getCategories(),
          tagsAPI.getTags()
        ]);
        
        const post = postRes.data;
        
        // Check if user is authorized to edit this post
        if (post.author_id !== user.id && !user.is_superuser) {
          setUnauthorized(true);
          return;
        }
        
        // Set form values
        setTitle(post.title);
        setContent(post.content);
        setSummary(post.summary || '');
        setCategoryId(post.category_id);
        setSelectedTags(post.tags.map((tag: Tag) => tag.id));
        
        // Set categories and tags
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load post data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [postId, isAuthenticated, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !categoryId) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const postData = {
        title,
        content,
        summary,
        category_id: categoryId,
        tag_ids: selectedTags.length > 0 ? selectedTags : undefined
      };
      
      await postsAPI.updatePost(postId, postData);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Failed to update post:', err);
      setError(err.response?.data?.detail || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show not found message
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white border border-blue-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show unauthorized message
  if (unauthorized) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white border border-blue-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Unauthorized</h1>
          <p className="text-gray-400 mb-6">You don't have permission to edit this post.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-orbitron text-blue-600 mb-8">EDIT POST</h1>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-gray-700 mb-2">
            Summary
          </label>
          <input
            id="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}