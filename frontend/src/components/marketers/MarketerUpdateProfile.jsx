import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MARKETER_API_END_POINT } from '@/utils/constant'
import { Camera, Briefcase, GraduationCap, MapPin, Phone, Mail, Plus, X } from 'lucide-react'

const EnhancedMarketerProfile = () => {
  const [profileData, setProfileData] = useState({
    fullname: '',
    phoneNumber: '',
    email: '',
    agencyName: '',
    bio: '',
    skills: '',
    location: '',
    profilePhoto: '',
    experiences: [],
    education: []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        if (!token) throw new Error('Token is not available. Please log in.')

        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        const userId = decodedToken.userId
        if (!userId) throw new Error('User ID is not found in the token.')

        const res = await axios.get(`${MARKETER_API_END_POINT}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setProfileData(res.data.profile || {
          fullname: '',
          phoneNumber: '',
          email: '',
          agencyName: '',
          bio: '',
          skills: '',
          location: '',
          profilePhoto: '',
          experiences: [],
          education: []
        })
        setSuccess('Profile loaded successfully.')
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      Object.keys(profileData).forEach(key => {
        if (key === 'profilePhoto' && profileData[key] instanceof File) {
          formData.append(key, profileData[key])
        } else if (key !== 'profilePhoto') {
          formData.append(key, profileData[key])
        }
      })

      await axios.post(`${MARKETER_API_END_POINT}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess('Profile updated successfully!')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData(prevData => ({ ...prevData, profilePhoto: file }))
    }
  }

  const addExperience = () => {
    setProfileData(prevData => ({
      ...prevData,
      experiences: [...prevData.experiences, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    }))
  }

  const updateExperience = (index, field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      experiences: prevData.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index) => {
    setProfileData(prevData => ({
      ...prevData,
      experiences: prevData.experiences.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setProfileData(prevData => ({
      ...prevData,
      education: [...prevData.education, { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]
    }))
  }

  const updateEducation = (index, field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      education: prevData.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index) => {
    setProfileData(prevData => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Update Profile</h1>
        
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - 70% */}
          <div className="lg:w-[70%]">
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 border[1px] rounded-lg p-6">
              <div className="mb-6 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={profileData.profilePhoto instanceof File ? URL.createObjectURL(profileData.profilePhoto) : profileData.profilePhoto || '/placeholder.svg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-200 border[1px] cursor-pointer">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      id="profilePhoto"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={profileData.fullname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    id="agencyName"
                    name="agencyName"
                    value={profileData.agencyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Sidebar - 30% */}
          <div className="lg:w-[30%]">
            {/* Experience Section */}
            <div className="bg-white border border-gray-200 border[1px] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Experience
              </h2>
              {profileData.experiences.map((exp, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                    />
                    <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company"
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full mb-1"
                  />
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      placeholder="Start Date"
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      placeholder="End Date"
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full resize-none"
                  />
                </div>
              ))}
              <button
                onClick={addExperience}
                className="mt-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </button>
            </div>

            {/* Education Section */}
            <div className="bg-white border border-gray-200 border[1px] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </h2>
              {profileData.education.map((edu, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      placeholder="School"
                      className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                    />
                    <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full mb-1"
                  />
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                    placeholder="Field of Study"
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full mb-1"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      placeholder="Start Date"
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      placeholder="End Date"
                      className="text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="mt-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedMarketerProfile