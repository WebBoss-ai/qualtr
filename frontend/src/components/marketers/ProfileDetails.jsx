import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, Linkedin, Edit, Calendar } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const formatDate = (month, year) => {
  const date = new Date(`${month} 1, ${year}`);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('#f8f9fa'); // Default background color
  const [showColorPicker, setShowColorPicker] = useState(false);

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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const lightColors = [
    '#f8f9fa', '#e9ecef', '#dee2e6', '#f1f3f5',
    '#e7f5ff', '#e6fcf5', '#fff5f7', '#fff9db',
    '#f8f0fc', '#ebfbee',
  ];

  return (
    <div className="bg-white min-h-screen" style={{ backgroundColor: bgColor }}>
      <Navbar />
      <div className="max-w-[1128px] mx-auto">
        {/* Banner and Profile Section */}
        <div className="relative">
          <div className="h-[200px] w-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
          <div className="absolute top-[120px] left-6 sm:left-4">
            {profile.profilePhoto && (
              <img
                src={profile.profilePhoto}
                alt={`${profile.fullname}'s Profile`}
                className="w-[160px] h-[160px] rounded-full border-4 border-white shadow-lg object-cover"
              />
            )}
          </div>
          <div className="absolute top-4 right-4">
            <button
              className="p-2 hover:bg-black/5 rounded-full"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Edit size={20} className="text-gray-600" />
            </button>
            {showColorPicker && (
              <div className="absolute top-10 right-0 bg-white shadow-lg p-4 rounded-lg grid grid-cols-5 gap-2">
                {lightColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBgColor(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 px-6 flex flex-col md:flex-row">
          {/* Main Content (70%) */}
          <div className="w-full md:w-[70%] pr-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{profile.fullname}</h1>
              <h2 className="text-lg text-gray-600 mt-1">{profile.agencyName}</h2>
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
              <h3 className="text-base font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
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

          {/* Sidebar (30%) */}
          <div className="w-full md:w-[30%]">
            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase size={18} className="mr-2" />
                Experience
              </h3>
              {profile.experiences?.length ? (
                <div className="space-y-6">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l border-gray-200">
                      <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-gray-200"></div>
                      <h4 className="text-sm font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar size={12} className="mr-1" />
                        <span>
                          {formatDate(exp.startDate.month, exp.startDate.year)} -{' '}
                          {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exp.location} • {exp.employmentType}</p>
                      {exp.description && <p className="mt-2 text-sm text-gray-600">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No experiences listed</p>
              )}
            </div>

            {/* Education */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap size={18} className="mr-2" />
                Education
              </h3>
              {profile.education?.length ? (
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l border-gray-200">
                      <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[5px] rounded-full bg-gray-200"></div>
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
                      {edu.grade && <p className="text-xs text-gray-500 mt-1">Grade: {edu.grade}</p>}
                      {edu.activitiesAndSocieties && (
                        <p className="mt-2 text-sm text-gray-600">{edu.activitiesAndSocieties}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No education history listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileDetails;