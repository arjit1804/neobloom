'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { postsAPI, commentsAPI } from '../../lib/api';

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

interface Comment {
  id: string;
  content: string;
  author: Author;
  created_at: string;
  like_count: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  reading_time: number;
  author: Author;
  category: Category;
  tags: Tag[];
}

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Fetch post and comments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch post
        const postRes = await postsAPI.getPostBySlug(slug);
        setPost(postRes.data);
        
        // Fetch comments
        const commentsRes = await commentsAPI.getCommentsByPost(postRes.data.id);
        setComments(commentsRes.data);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load post. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const handleLikePost = async () => {
    if (!post) return;
    
    try {
      await postsAPI.likePost(post.id);
      setPost({
        ...post,
        like_count: post.like_count + 1
      });
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const commentData = {
        content: newComment,
        post_id: post?.id
      };
      
      const response = await commentsAPI.createComment(commentData);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-400">Loading post...</p>
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
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4">
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
              href={`/categories/${post.category.slug}`}
              className="bg-gray-100 text-blue-600 px-3 py-1 rounded-md text-sm mr-2 mb-2 hover:bg-gray-200"
            >
              {post.category.name}
            </Link>
            
            {post.tags.map(tag => (
              <Link 
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm mr-2 mb-2 hover:bg-gray-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          
          {post.summary && (
            <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700 italic">{post.summary}</p>
            </div>
          )}
        </header>
        
        {/* Post Content */}
        <div className="prose max-w-none text-gray-800 mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>
        
        {/* Post Actions */}
        <div className="flex items-center justify-between border-t border-b border-gray-800 py-4 mb-8">
          <button
            onClick={handleLikePost}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Like ({post.like_count})
          </button>
          
          {isAuthenticated && user?.id === post.author.id && (
            <div className="flex space-x-4">
              <Link 
                href={`/posts/edit/${post.id}`}
                className="text-blue-600 hover:text-blue-500"
              >
                Edit
              </Link>
              <button 
                className="text-red-400 hover:text-red-300"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this post?')) {
                    postsAPI.deletePost(post.id)
                      .then(() => {
                        router.push('/dashboard');
                      })
                      .catch((err: any) => {
                        console.error('Failed to delete post:', err);
                        setError('Failed to delete post. Please try again.');
                      });
                  }
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h2>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated ? "Add a comment..." : "Please login to comment"}
                className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                disabled={!isAuthenticated || isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-600">
                        {comment.author.full_name || comment.author.username}
                      </span>
                      <span className="text-gray-600 hover:text-blue-600 text-sm ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await commentsAPI.likeComment(comment.id);
                          setComments(comments.map(c => 
                            c.id === comment.id 
                              ? { ...c, like_count: c.like_count + 1 } 
                              : c
                          ));
                        } catch (err) {
                          console.error('Failed to like comment:', err);
                        }
                      }}
                      className="text-gray-400 hover:text-blue-400 text-sm"
                    >
                      ♥ {comment.like_count}
                    </button>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
} 