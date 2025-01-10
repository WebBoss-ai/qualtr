import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, Linkedin } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const ProfileDetails = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.success) {
                    setProfile(response.data.profile);
                } else {
                    setError(response.data.message || 'Error fetching profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('An error occurred while fetching the profile.');
            }
        };

        fetchProfile();
    }, [id]);

    if (error) {
        return <p className="text-red-500 text-center py-8">{error}</p>;
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#17B169]"></div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="lg:flex">
                        {/* Left column (70%) */}
                        <div className="lg:w-[70%] p-8">
                            <div className="flex items-center mb-8">
                                {profile.profilePhoto && (
                                    <img
                                        src={profile.profilePhoto}
                                        alt={`${profile.fullname}'s Profile`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-[#17B169]"
                                    />
                                )}
                                <div className="ml-6">
                                    <h1 className="text-3xl font-bold text-gray-900">{profile.fullname}</h1>
                                    <p className="text-xl text-[#17B169]">{profile.agencyName}</p>
                                    <div className="flex items-center mt-2 text-gray-600">
                                        <MapPin size={18} className="mr-2" />
                                        <span>{profile.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">About</h2>
                                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map((skill, index) => (
                                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={18} className="mr-2" />
                                        <span>email@example.com</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={18} className="mr-2" />
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Globe size={18} className="mr-2" />
                                        <span>www.example.com</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Linkedin size={18} className="mr-2" />
                                        <span>linkedin.com/in/username</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column (30%) */}
                        <div className="lg:w-[30%] bg-gray-50 p-8 border-l border-gray-200">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <Briefcase size={24} className="mr-2 text-[#17B169]" />
                                    Experience
                                </h2>
                                {profile.experiences && profile.experiences.length > 0 ? (
                                    <ul className="space-y-6">
                                        {profile.experiences.map((exp, index) => (
                                            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                <h3 className="font-semibold text-lg text-gray-800">{exp.title}</h3>
                                                <p className="text-[#17B169]">{exp.company}</p>
                                                <p className="text-sm text-gray-600">{exp.employmentType}</p>
                                                <p className="text-sm text-gray-600">
                                                    {exp.startDate.month} {exp.startDate.year} -
                                                    {exp.isCurrent ? 'Present' : `${exp.endDate?.month} ${exp.endDate?.year}`}
                                                </p>
                                                <p className="text-sm text-gray-600">{exp.location} ({exp.locationType})</p>
                                                {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">No experiences listed.</p>
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                                    <GraduationCap size={24} className="mr-2 text-[#17B169]" />
                                    Education
                                </h2>
                                {profile.education && profile.education.length > 0 ? (
                                    <ul className="space-y-6">
                                        {profile.education.map((edu, index) => (
                                            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                <h3 className="font-semibold text-lg text-gray-800">{edu.school}</h3>
                                                <p className="text-[#17B169]">{edu.degree}, {edu.fieldOfStudy}</p>
                                                <p className="text-sm text-gray-600">
                                                    {edu.startDate?.month} {edu.startDate?.year} -
                                                    {edu.endDate?.month} {edu.endDate?.year}
                                                </p>
                                                {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                                                {edu.activitiesAndSocieties && (
                                                    <p className="mt-2 text-sm text-gray-700">{edu.activitiesAndSocieties}</p>
                                                )}
                                                {edu.description && <p className="mt-2 text-sm text-gray-700">{edu.description}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">No education listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfileDetails;