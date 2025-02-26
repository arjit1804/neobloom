'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi'

// Mock data for trending topics
const TRENDING_TOPICS = [
  {
    id: 1,
    name: 'Artificial Intelligence',
    count: 128,
    trend: 'up',
    percentage: 24,
    slug: 'artificial-intelligence',
    color: 'neon-blue'
  },
  {
    id: 2,
    name: 'Cyberpunk Design',
    count: 96,
    trend: 'up',
    percentage: 18,
    slug: 'cyberpunk-design',
    color: 'neon-pink'
  },
  {
    id: 3,
    name: 'Machine Learning',
    count: 87,
    trend: 'up',
    percentage: 15,
    slug: 'machine-learning',
    color: 'neon-green'
  },
  {
    id: 4,
    name: 'Web Development',
    count: 76,
    trend: 'up',
    percentage: 12,
    slug: 'web-development',
    color: 'neon-purple'
  },
  {
    id: 5,
    name: 'Digital Marketing',
    count: 65,
    trend: 'up',
    percentage: 9,
    slug: 'digital-marketing',
    color: 'neon-yellow'
  },
  {
    id: 6,
    name: 'Content Creation',
    count: 54,
    trend: 'up',
    percentage: 7,
    slug: 'content-creation',
    color: 'neon-orange'
  }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

export default function TrendingTopics() {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null)

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {TRENDING_TOPICS.map((topic) => (
        <motion.div 
          key={topic.id}
          className="glass-card group relative overflow-hidden"
          variants={itemVariants}
          onMouseEnter={() => setHoveredTopic(topic.id)}
          onMouseLeave={() => setHoveredTopic(null)}
        >
          {/* Background glow effect */}
          <div 
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${topic.color}`}
          ></div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold text-${topic.color}`}>
              {topic.name}
            </h3>
            <div className={`flex items-center text-${topic.color}`}>
              <FiTrendingUp className="mr-1" />
              <span className="text-sm font-medium">+{topic.percentage}%</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="h-2 bg-cyber-light/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${topic.color} rounded-full`}
                style={{ width: `${(topic.count / 150) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{topic.count} articles</span>
            <Link 
              href={`/topics/${topic.slug}`}
              className={`flex items-center text-sm font-medium transition-colors duration-300 text-${topic.color}`}
            >
              Explore <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 