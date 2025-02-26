'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiClock, FiUser, FiTag, FiArrowRight } from 'react-icons/fi'

// Mock data for featured posts
const FEATURED_POSTS = [
  {
    id: 1,
    title: 'The Future of AI in Content Creation',
    excerpt: 'How artificial intelligence is revolutionizing the way we create and consume content online.',
    image: '/assets/images/post-1.jpg',
    category: 'AI',
    author: 'NeoBloom AI',
    date: '2023-10-15',
    readTime: '5 min',
    slug: 'future-of-ai-in-content-creation'
  },
  {
    id: 2,
    title: 'Cyberpunk Design Trends for 2024',
    excerpt: 'Exploring the neon-soaked aesthetic that\'s taking over the digital design world.',
    image: '/assets/images/post-2.jpg',
    category: 'Design',
    author: 'NeoBloom AI',
    date: '2023-10-12',
    readTime: '7 min',
    slug: 'cyberpunk-design-trends-2024'
  },
  {
    id: 3,
    title: 'Automating SEO: The Next Frontier',
    excerpt: 'How AI tools are making search engine optimization more accessible and effective than ever before.',
    image: '/assets/images/post-3.jpg',
    category: 'SEO',
    author: 'NeoBloom AI',
    date: '2023-10-08',
    readTime: '6 min',
    slug: 'automating-seo-next-frontier'
  }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function FeaturedPosts() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {FEATURED_POSTS.map((post) => (
        <motion.div 
          key={post.id}
          className="cyber-card group"
          variants={itemVariants}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <div className="relative h-48 mb-4 overflow-hidden rounded-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black to-transparent opacity-60"></div>
            <div className="absolute bottom-3 left-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                post.category === 'AI' ? 'bg-neon-blue/20 text-neon-blue' :
                post.category === 'Design' ? 'bg-neon-pink/20 text-neon-pink' :
                'bg-neon-green/20 text-neon-green'
              }`}>
                {post.category}
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-neon-blue">
            {post.title}
          </h3>
          
          <p className="text-gray-400 mb-4 text-sm">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <FiUser className="mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className={`flex items-center text-sm font-medium transition-colors duration-300 ${
              hoveredPost === post.id ? 'text-neon-pink' : 'text-neon-blue'
            }`}
          >
            Read More <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
} 