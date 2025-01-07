import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import ExperiencesModal from './ExperiencesModal';
import EducationModal from './EducationModal';


const MarketerUpdateProfile = () => {
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneNumber: '',
        agencyName: '',
        bio: '',
        skills: '',
        location: '',
        profilePhoto: '',
        experiences: [],
        education: [],
    });

    const [selectedExperiences, setSelectedExperiences] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);

    const [isModalOpen1, setModalOpen1] = useState(false);
    const experiences = []; // Fetch or pass initial experiences

    const [isModalOpen2, setModalOpen2] = useState(false);
    const education = []; // Fetch or pass initial experiences

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const token = localStorage.getItem('token');

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            throw new Error('Invalid or expired token. Please log in again.');
        }
    };
    const handleEditExperiences = (experiences) => {
        setSelectedExperiences(experiences); // Store the experience in a state
        setModalOpen1(true); // Open the modal
    };
    
    const handleDeleteExperiences = async (id) => {
        try {
            const res = await axios.delete(`${MARKETER_API_END_POINT}/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData((prevData) => ({
                ...prevData,
                experiences: prevData.experiences.filter((exp) => exp._id !== id),
            }));
            alert(res.data.message || 'Experience deleted successfully.');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to delete experience.');
        }
    };
    
    const handleEditEducation = (education) => {
        setSelectedEducation(education); // Store the education in a state
        setModalOpen2(true); // Open the modal
    };
    
    const handleDeleteEducation = async (id) => {
        try {
            const res = await axios.delete(`${MARKETER_API_END_POINT}/education/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData((prevData) => ({
                ...prevData,
                education: prevData.education.filter((edu) => edu._id !== id),
            }));
            alert(res.data.message || 'Education deleted successfully.');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to delete education.');
        }
    };
    

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                if (!token) {
                    throw new Error('Token is not available. Please log in.');
                }

                const decodedToken = decodeToken(token);
                const userId = decodedToken.userId;
                if (!userId) {
                    throw new Error('User ID is not found in the token.');
                }

                const endpoint = `${MARKETER_API_END_POINT}/profile/${userId}`;
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfileData(res.data.profile || {
                    fullname: '',
                    phoneNumber: '',
                    agencyName: '',
                    bio: '',
                    skills: '',
                    location: '',
                    profilePhoto: '',
                    experiences: [],
                    education: [],
                });
                setSuccess('Profile loaded successfully.');
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            for (const key in profileData) {
                if (key === 'profilePhoto' && profileData[key]) {
                    formData.append(key, profileData[key]);
                } else {
                    formData.append(key, profileData[key]);
                }
            }

            const res = await axios.post(`${MARKETER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Profile</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="fullname"
                    value={profileData.fullname}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                />
                <input
                    type="text"
                    name="agencyName"
                    value={profileData.agencyName}
                    onChange={handleChange}
                    placeholder="Agency Name"
                    required
                />
                <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Bio"
                />
                <input
                    type="text"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                />
                <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
                <input
                    type="file"
                    name="profilePhoto"
                    onChange={(e) =>
                        setProfileData((prevData) => ({
                            ...prevData,
                            profilePhoto: e.target.files[0],
                        }))
                    }
                />
                <button type="submit" disabled={loading}>Update Profile</button>
            </form>

            <h3>Experiences</h3>
            {profileData.experiences && profileData.experiences.length > 0 ? (
                <ul>
                    {profileData.experiences.map((exp, index) => (
                        <li key={index}>
                            <p><strong>Title:</strong> {exp.title}</p>
                            <p><strong>Company:</strong> {exp.company}</p>
                            <p><strong>Employment Type:</strong> {exp.employmentType}</p>
                            <p><strong>Location:</strong> {exp.location} ({exp.locationType})</p>
                            <p><strong>Duration:</strong>
                                {exp.startDate.month} {exp.startDate.year} -
                                {exp.isCurrent ? 'Present' : `${exp.endDate?.month} ${exp.endDate?.year}`}
                            </p>
                            {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
                            <button onClick={() => handleEditExperiences(exp)}>Edit</button>
                            <button onClick={() => handleDeleteExperiences(exp._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No experiences listed.</p>
            )}

            <h3>Education</h3>
            {profileData.education && profileData.education.length > 0 ? (
                <ul>
                    {profileData.education.map((edu, index) => (
                        <li key={index}>
                            <p><strong>School:</strong> {edu.school}</p>
                            <p><strong>Degree:</strong> {edu.degree}</p>
                            <p><strong>Field of Study:</strong> {edu.fieldOfStudy}</p>
                            <p><strong>Grade:</strong> {edu.grade || 'N/A'}</p>
                            <p><strong>Duration:</strong>
                                {edu.startDate?.month} {edu.startDate?.year} -
                                {edu.endDate?.month} {edu.endDate?.year}
                            </p>
                            {edu.activitiesAndSocieties && (
                                <p><strong>Activities and Societies:</strong> {edu.activitiesAndSocieties}</p>
                            )}
                            {edu.description && <p><strong>Description:</strong> {edu.description}</p>}
                            <button onClick={() => handleEditEducation(edu)}>Edit</button>
                            <button onClick={() => handleDeleteEducation(edu._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No education listed.</p>
            )}

            <button onClick={() => setModalOpen1(true)}>Edit Experiences</button>
            <ExperiencesModal
                isOpen={isModalOpen1}
                onClose={() => setModalOpen1(false)}
                initialExperiences={experiences}
                experiences={selectedExperiences}
            />

            <button onClick={() => setModalOpen2(true)}>Edit Education</button>
            <EducationModal
                isOpen={isModalOpen2}
                onClose={() => setModalOpen2(false)}
                initialEducation={education}
                education={selectedEducation}
            />
        </div>
    );
};

export default MarketerUpdateProfile;
