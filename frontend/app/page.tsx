'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsAPI, categoriesAPI, tagsAPI } from './lib/api';

interface Author {
  id: string;
  username: string;
  full_name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  created_at: string;
  view_count: number;
  like_count: number;
  reading_time: number;
  author: Author;
  category: Category;
  tags: Tag[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch posts, categories, and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch initial data
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          postsAPI.getPosts({ limit: 10 }),
          categoriesAPI.getCategories(),
          tagsAPI.getTags({ limit: 10 })
        ]);
        
        setPosts(postsRes.data);
        setCategories(categoriesRes.data);
        setPopularTags(tagsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch filtered posts when filters change
  useEffect(() => {
    const fetchFilteredPosts = async () => {
      try {
        setIsLoading(true);
        
        const params: any = { limit: 10 };
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        if (selectedTag) {
          params.tag = selectedTag;
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        const response = await postsAPI.getPosts(params);
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch filtered posts:', err);
        setError('Failed to apply filters. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if any filter is applied
    if (selectedCategory || selectedTag || searchTerm) {
      fetchFilteredPosts();
    }
  }, [selectedCategory, selectedTag, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect above
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchTerm('');
    
    // Fetch initial posts again
    postsAPI.getPosts({ limit: 10 })
      .then(response => {
        setPosts(response.data);
      })
      .catch(err => {
        console.error('Failed to reset posts:', err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold font-orbitron text-blue-600 mb-8">NEOBLOOM</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="flex-grow bg-gray-100 border border-gray-300 rounded-l-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Active Filters */}
          {(selectedCategory || selectedTag) && (
            <div className="flex items-center mb-6">
              <span className="text-gray-600 mr-2">Active filters:</span>
              {selectedCategory && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm mr-2">
                  {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="bg-gray-500 text-white px-2 py-1 rounded-md text-sm mr-2">
                  #{popularTags.find(t => t.slug === selectedTag)?.name || selectedTag}
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-gray-600 text-sm hover:text-blue-600 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {/* Posts List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-blue-200 rounded-lg p-8 text-center shadow-sm">
              <p className="text-gray-600 mb-4">No posts found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear filters and try again
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white border border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors shadow-sm">
                  <Link href={`/posts/${post.slug}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
                    <span className="mr-4">
                      By <Link href={`/users/${post.author.username}`} className="text-blue-600 hover:underline">
                        {post.author.full_name || post.author.username}
                      </Link>
                    </span>
                    <span className="mr-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="mr-4">
                      {post.reading_time} min read
                    </span>
                    <span className="mr-4">
                      {post.view_count} views
                    </span>
                    <span>
                      {post.like_count} likes
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center mb-4">
                    <Link 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(post.category.slug);
                      }}
                      className="bg-gray-100 text-blue-600 px-3 py-1 rounded-md text-sm mr-2 mb-2 hover:bg-gray-200"
                    >
                      {post.category.name}
                    </Link>
                    
                    {post.tags.slice(0, 3).map(tag => (
                      <Link 
                        key={tag.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTag(tag.slug);
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm mr-2 mb-2 hover:bg-gray-200"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-gray-500 text-sm">+{post.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  {post.summary && (
                    <p className="text-gray-700 mb-4">{post.summary}</p>
                  )}
                  
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3">
          {/* Categories */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category.slug);
                    }}
                    className={`block py-1 px-2 rounded hover:bg-gray-100 ${
                      selectedCategory === category.slug 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Tags */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link 
                  key={tag.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTag(tag.slug);
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 