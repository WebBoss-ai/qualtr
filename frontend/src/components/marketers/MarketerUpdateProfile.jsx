import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MARKETER_API_END_POINT } from '@/utils/constant'
import { Camera, Briefcase, GraduationCap, MapPin, Phone, Mail, Plus, X } from 'lucide-react'
import ExperiencesPage from './ExperiencesPage'
import EducationModal from './EducationModal'
import EducationPage from './EducationPage'
import ExperiencesModal from './ExperiencesModal'
import UserProfilePosts from './post/UserProfilePosts'
import Footer2 from '../shared/Footer2'
import Navbar2 from '../shared/Navbar2'

const EnhancedMarketerProfile = () => {
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneNumber: '',
        agencyName: '',
        bio: '',
        skills: '',
        location: '',
        website:'',
        profilePhoto: '',
        experiences: [],
        education: []
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [selectedExperiences, setSelectedExperiences] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);

    const [isModalOpen1, setModalOpen1] = useState(false);
    const experiences = []; // Fetch or pass initial experiences

    const [isModalOpen2, setModalOpen2] = useState(false);
    const education = []; // Fetch or pass initial experiences

    const token = localStorage.getItem('token');

    let id = null;
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        id = decodedToken.userId || null;
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    
    useEffect(() => {
      if (token) {
        fetchProfile();
      }
    }, [token]);
    
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);
    
      if (!token) {
        setError("Token is missing. Please log in.");
        setLoading(false);
        return;
      }
    
      let userId = null;
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userId = decodedToken.userId;
      } catch (error) {
        setError("Invalid token. Please log in again.");
        setLoading(false);
        return;
      }
    
      if (!userId) {
        setError("User ID not found in token.");
        setLoading(false);
        return;
      }
    
      try {
        const res = await axios.get(`${MARKETER_API_END_POINT}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        setProfileData(res.data.profile || {
          fullname: '',
          phoneNumber: '',
          agencyName: '',
          bio: '',
          skills: '',
          location: '',
          website: '',
          profilePhoto: '',
          experiences: [],
          education: []
        });
    
        setSuccess("Profile loaded successfully.");
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    
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
        <div>
            <Navbar2 />
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
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input
                                            type="text"
                                            id="website"
                                            name="website"
                                            value={profileData.website}
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
                                            required
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
                                            required
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
                                            required
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
                            <UserProfilePosts id={id} />
                        </div>

                        {/* Sidebar - 30% */}
                        <div className="lg:w-[30%]">
                            <ExperiencesPage profileData={profileData} setProfileData={setProfileData} fetchProfile={fetchProfile} />
                            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                <button
                                    onClick={() => setModalOpen1(true)}
                                    style={{
                                        borderTop: "0.5px solid #e6e6e6",
                                        borderBottom: "0.5px solid #e6e6e6",
                                        backgroundColor: "#fff",
                                        padding: "8px 0",
                                        marginBottom: "32px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        width: "100%",
                                        textAlign: "center",
                                        transition: "background-color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#f2f2f2")}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
                                >
                                    Add Experience
                                </button>
                            </div>
                            <EducationPage profileData={profileData} setProfileData={setProfileData} fetchProfile={fetchProfile} />

                            <ExperiencesModal
                                isOpen={isModalOpen1}
                                onClose={() => setModalOpen1(false)}
                                initialExperiences={experiences}
                                experiences={selectedExperiences}
                            />
                            <button
                                onClick={() => setModalOpen2(true)}
                                style={{
                                    borderTop: "0.5px solid #e6e6e6",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    backgroundColor: "#fff",
                                    padding: "8px 0",
                                    marginBottom: "32px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    width: "100%",
                                    textAlign: "center",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f2f2f2")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
                            >
                                Edit Education
                            </button>
                            <EducationModal
                                isOpen={isModalOpen2}
                                onClose={() => setModalOpen2(false)}
                                initialEducation={education}
                                education={selectedEducation}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer2 />
        </div>
    )
}

export default EnhancedMarketerProfile