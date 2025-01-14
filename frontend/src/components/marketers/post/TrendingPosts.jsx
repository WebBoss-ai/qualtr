import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MARKETER_API_END_POINT } from "@/utils/constant"
import { TrendingUp, ChevronRight, MessageCircle, ThumbsUp, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const TrendingPosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get(`${MARKETER_API_END_POINT}/posts/trending`)
        if (data.success) {
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">Trending Posts</h2>
          </div>
          <Link 
            to="/trending"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 group"
          >
            View all
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {posts.map((post) => (
          <div 
            key={post._id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Link 
                    to={post.profileLink}
                    className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
                  >
                    {post.author?.profile?.fullname}
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {post.author?.profile?.agencyName}
                  </p>
                </div>
              </div>

              <Link to={`/post/${post._id}`} className="block">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.text}
                </p>
              </Link>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    <span>{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{post.comments || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.impressions || 0}</span>
                  </div>
                </div>
                <span>{post.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No trending posts available
        </div>
      )}
    </div>
  )
}

export default TrendingPosts