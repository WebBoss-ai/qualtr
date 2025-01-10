import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { MARKETER_API_END_POINT } from '@/utils/constant'
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, Linkedin, Edit, Calendar, CheckCircle } from 'lucide-react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'

const formatDate = (month, year) => {
    const date = new Date(`${month} 1, ${year}`);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const ProfileDetails = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                if (response.data.success) {
                    setProfile(response.data.profile)
                } else {
                    setError(response.data.message || 'Error fetching profile')
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
                setError('An error occurred while fetching the profile.')
            }
        }

        fetchProfile()
    }, [id])

    if (error) {
        return <p className="text-red-500 text-center py-8">{error}</p>
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Banner and Profile Section */}
                <div className="relative">
                    <div className="h-52 w-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
                    <div className="absolute top-28 left-4 sm:left-8">
                        {profile.profilePhoto && (
                            <img
                                src={profile.profilePhoto}
                                alt={`${profile.fullname}'s Profile`}
                                className="w-40 h-40 rounded-full border-4 border-white object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute top-4 right-4">
                        <button className="p-2 hover:bg-black/5 rounded-full">
                            <Edit size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold mt-12 text-gray-900 flex items-center">
                                {profile.fullname}
                                {profile.isVerified && (
                                    <CheckCircle size={20} className="text-blue-500 ml-2" />
                                )}
                            </h1>
                            <h2 className="text-lg font-light text-gray-600 mt-1">{profile.agencyName}</h2>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <MapPin size={16} className="mr-1" />
                                <span>{profile.location}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl mb-4">
                            <div className="prose max-w-none text-gray-600 text-sm">
                                {profile.bio}
                            </div>
                        </div>

                        <div className="mb-8">
                            {profile.skills?.length ? (
                                <>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills[0]
                                            .split(",")
                                            .map(skill => skill.trim())
                                            .map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-50 border border-gray-400 rounded-[6px] text-sm text-gray-600"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500">No skills available.</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <Mail size={16} className="mr-2" />
                                    <span>email@example.com</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone size={16} className="mr-2" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Globe size={16} className="mr-2" />
                                    <span>www.example.com</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Linkedin size={16} className="mr-2" />
                                    <span>linkedin.com/in/username</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="mb-8">
                            <h3 className="text-base mt-12 font-semibold text-gray-900 mb-4 flex items-center">
                                <Briefcase size={18} className="mr-2" />
                                Experience
                            </h3>
                            {profile.experiences && profile.experiences.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.experiences.map((exp, index) => (
                                        <div key={index} className="relative pl-6 border-l border-gray-200">
                                            <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-gray-200"></div>
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-900">{exp.title}</h4>
                                                <p className="text-sm text-gray-600">{exp.company}</p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Calendar size={12} className="mr-1" />
                                                    <span>
                                                        {formatDate(exp.startDate.month, exp.startDate.year)} -{' '}
                                                        {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {exp.location} • {exp.employmentType}
                                                </p>
                                                {exp.description && (
                                                    <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No experiences listed</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                <GraduationCap size={18} className="mr-2" />
                                Education
                            </h3>
                            {profile.education && profile.education.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.education.map((edu, index) => (
                                        <div key={index} className="relative pl-6 border-l border-gray-200">
                                            <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-gray-200"></div>
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-900">{edu.school}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {edu.degree} • {edu.fieldOfStudy}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Calendar size={12} className="mr-1" />
                                                    <span>
                                                        {formatDate(edu.startDate?.month, edu.startDate?.year)} -{' '}
                                                        {formatDate(edu.endDate?.month, edu.endDate?.year)}
                                                    </span>
                                                </div>
                                                {edu.grade && (
                                                    <p className="text-xs text-gray-500 mt-1">Grade: {edu.grade}</p>
                                                )}
                                                {edu.activitiesAndSocieties && (
                                                    <p className="mt-2 text-sm text-gray-600">{edu.activitiesAndSocieties}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No education listed</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileDetails