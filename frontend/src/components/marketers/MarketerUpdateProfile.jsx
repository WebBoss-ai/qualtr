import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import * as jwtDecode from 'jwt-decode'; // Adjust the import as needed

const MarketerUpdateProfile = () => {
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneNumber: '',
        agencyName: '',
        bio: '',
        skills: '',
        location: '',
        profilePhoto: ''
    });

    const token = localStorage.getItem('token');
    console.log('Token retrieved from localStorage:', token);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log('Fetching profile data...');
            setLoading(true);
            setError(null);

            try {
                if (!token) {
                    throw new Error('Token is not available or invalid.');
                }

                // Decode the token to extract the user ID
                let decodedToken;
                try {
                    decodedToken = jwtDecode.default(token); // Adjust as needed
                    console.log('Decoded Token:', decodedToken);
                } catch (decodeError) {
                    console.error('Failed to decode token:', decodeError);
                    throw new Error('Invalid or expired token. Please log in again.');
                }

                const userId = decodedToken.userId;
                if (!userId) {
                    throw new Error('User ID is not found in the token.');
                }
                console.log('Decoded User ID:', userId);

                // Fetch profile data using the user ID
                const endpoint = `${MARKETER_API_END_POINT}/profile/${userId}`;
                console.log('API Endpoint:', endpoint);

                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('API Response:', res.data);

                setProfileData(res.data.profile || {
                    fullname: '',
                    phoneNumber: '',
                    agencyName: '',
                    bio: '',
                    skills: '',
                    location: '',
                    profilePhoto: ''
                });
            } catch (error) {
                console.error('Error while fetching profile data:', error);
                setError(error.message || 'Failed to load profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Updating field: ${name}, Value: ${value}`);
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', profileData);

        try {
            setError(null);
            setLoading(true);

            const formData = new FormData(); // Handle file uploads properly
            for (const key in profileData) {
                if (key === 'profilePhoto' && profileData[key]) {
                    formData.append(key, profileData[key]); // Append file separately
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

            console.log('Profile update response:', res.data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);
            setError('Failed to update profile. Please try again.');
            alert('Profile update failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
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
                onChange={(e) => {
                    console.log('File uploaded:', e.target.files[0]);
                    setProfileData((prevData) => ({
                        ...prevData,
                        profilePhoto: e.target.files[0],
                    }));
                }}
            />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default MarketerUpdateProfile;
