import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MARKETER_API_END_POINT } from '@/utils/constant'
import { Search, MapPin, Building2, Users, X, ChevronDown, Filter, Globe } from 'lucide-react'
import debounce from 'lodash.debounce'
import TrendingPosts from './post/TrendingPosts'
import Footer from '../shared/Footer'
import Navbar from '../shared/Navbar'

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Sign in to continue</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600">Please sign in to view profiles and connect with other marketers.</p>
        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = '/marketer/login')}
            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const AdvancedSearch = ({ onSearch, isExpanded, onToggle }) => {
  const [filters, setFilters] = useState({
    fullname: '',
    location: '',
    agencyName: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
    onSearch({ ...filters, [name]: value })
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="fullname"
              placeholder="Search by name, tag, or location"
              value={filters.fullname}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            />
          </div>
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="agencyName"
                placeholder="Tag"
                value={filters.agencyName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ProfileList = () => {
  const [profiles, setProfiles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const fetchProfiles = async (filters = {}) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {}; // Use empty headers for unauthenticated users

        const response = await axios.get(`${MARKETER_API_END_POINT}/profiles`, {
            headers,
            params: filters,
        });

        setProfiles(response.data.profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error.message);
    }
};

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (token && userId) {
      setUser({ id: userId, token })
    }

    fetchProfiles()
  }, [])

  const handleSearch = useCallback(
    debounce((filters) => {
      fetchProfiles(filters)
    }, 300),
    []
  )

  const handleFollow = async (id, e) => {
    e.stopPropagation()
    if (!user) {
      setIsModalOpen(true)
      return
    }

    try {
      await axios.post(
        `${MARKETER_API_END_POINT}/profiles/follow`,
        { userId: user.id, followId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )

      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === id
            ? {
                ...profile,
                isFollowing: true,
                followers: profile.followers + 1,
              }
            : profile
        )
      )
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const handleProfileClick = (id) => {
    if (!user) {
      setIsModalOpen(true)
      return
    }
    navigate(`/marketer-profile/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main content - 70% */}
          <div className="lg:flex-1">
            <AdvancedSearch
              onSearch={handleSearch}
              isExpanded={isFiltersExpanded}
              onToggle={() => setIsFiltersExpanded(!isFiltersExpanded)}
            />
            <div className="mt-6 space-y-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleProfileClick(profile.id)}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={profile.profilePhoto || '/placeholder.svg'}
                      alt={profile.fullname}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.fullname}</h3>
                      <p className="text-sm text-gray-600 truncate mt-1">{profile.agencyName}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{profile.followers} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span>{profile.website || 'Website not available'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleFollow(profile.id, e)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        profile.isFollowing
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                      disabled={profile.isFollowing}
                    >
                      {profile.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending section - 30% */}
          <div className="hidden lg:block lg:w-80">
            <div className="sticky top-24">
              <TrendingPosts />
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  )
}

export default ProfileList