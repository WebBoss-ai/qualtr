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
        profilePhoto: ''
    });

    const token = localStorage.getItem('token');
    console.log(token);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log('Fetching profile data...');
            setLoading(true);
            setError(null);

            try {
                // Decode token to get user ID
                const decodedToken = jwtDecode(token); // Ensure `token` is available in your component
                const userId = decodedToken.userId;
                console.log('Decoded User ID:', userId);

                // Fetch profile data
                console.log('API Endpoint:', `${MARKETER_API_END_POINT}/profile/${userId}`);
                const res = await axios.get(`${MARKETER_API_END_POINT}/profile/${userId}`, {
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
                console.error('Failed to fetch profile:', error);
                setError('Failed to load profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);


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

            const res = await axios.post(`${MARKETER_API_END_POINT}/profile/update`, profileData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
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
