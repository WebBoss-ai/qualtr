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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/users/profile');
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
            }
        };
        fetchProfile();
    }, []);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${MARKETER_API_END_POINT}/profile/update`, profileData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Profile update failed.');
        }
    };

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
                onChange={handleChange}
            />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default MarketerUpdateProfile;
