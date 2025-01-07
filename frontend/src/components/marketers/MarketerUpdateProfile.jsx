import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const MarketerUpdateProfile = () => {
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneNumber: '',
        agencyName: '',
        bio: '',
        skills: '',
        location: '',
        profilePhoto: '',
    });

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
        </div>
    );
};

export default MarketerUpdateProfile;
