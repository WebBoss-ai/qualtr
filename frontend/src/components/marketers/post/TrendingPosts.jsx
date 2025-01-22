import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MARKETER_API_END_POINT } from "@/utils/constant"
import { TrendingUp, ChevronRight, MessageCircle, ThumbsUp, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'; // Import html-react-parser
import DOMPurify from 'dompurify';
const TrendingPosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

      const ExpandableText = ({ text, maxLength = 100, className = '' }) => {
          const [isExpanded, setIsExpanded] = useState(false);
  
          const toggleExpand = () => {
              setIsExpanded(!isExpanded);
          };
  
          const isExpandable = text.length > maxLength;
          const displayedText = isExpanded ? text : text.slice(0, maxLength);
  
          // Function to modify links and sanitize text
          const modifyLinks = (rawText) => {
              // Match URLs but ensure that they are not followed immediately by </p>
              const urlRegex = /(\bhttps?:\/\/[^\s]+)(?=\s*(?!<\/p>))/g;
  
              // Replace plain URLs with anchor tags
              let withLinks = rawText.replace(urlRegex, (url) => {
                  return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
              });
  
              // Update existing <a> tags to include target="_blank" and styling
              const anchorRegex = /<a(.*?)href="(.*?)"(.*?)>/g;
              const enhancedLinks = withLinks.replace(anchorRegex, (match, p1, p2, p3) => {
                  return `<a${p1}href="${p2}" target="_blank" class="text-blue-500 hover:underline"${p3}>`;
              });
  
              // Sanitize the final text to avoid rendering malicious or invalid HTML
              return DOMPurify.sanitize(enhancedLinks);
          };
  
  
  
          const modifiedText = modifyLinks(displayedText); // Apply link modifications and sanitize
  
          return (
              <div>
                  <p className={`${className} inline`}>
                      {/* Use html-react-parser to render sanitized and modified HTML */}
                      {parse(modifiedText)}
                      {!isExpanded && isExpandable && <span>...</span>}
                  </p>
                  {isExpandable && (
                      <button
                          onClick={toggleExpand}
                          className="text-blue-500 text-sm font-medium hover:underline focus:outline-none inline ml-1"
                      >
                          {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                  )}
              </div>
          );
      };

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
                    to={post.profileLink || '#'}
                    className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
                  >
                    {post.author?.profile?.fullname || 'Anonymous'}
                  </Link>

                  <p className="text-xs text-gray-500 line-clamp-1">
                    {post.author?.profile?.agencyName || 'Agency not specified'}
                  </p>
                </div>
              </div>

              <Link to={`/post/${post._id}`} className="block">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.text && (
                    <ExpandableText
                      className="text-gray-600 text-sm mb-4"
                      text={post.text}
                      maxLength={200}
                    />
                  )}
                </p>
              </Link>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    <span>{post?.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{post?.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post?.impressions || 0}</span>
                  </div>
                </div>
                <span>{post?.timeAgo || 'N/A'}</span>
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