import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            console.log("Fetching profiles..."); // Debugging statement
            try {
                const token = localStorage.getItem('token');
                console.log("Token:", token); // Debugging statement
                const response = await axios.get(`${MARKETER_API_END_POINT}/profiles`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Add JWT token
                    }
                });
                console.log("Profiles fetched successfully:", response.data.profiles); // Debugging statement
                setProfiles(response.data.profiles);
            } catch (error) {
                console.error('Error fetching profiles:', error); // Debugging statement
            }
        };

        fetchProfiles();
    }, []);

    const handleFollow = async (id) => {
        console.log(`Attempting to follow profile with ID: ${id}`); // Debugging statement
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            console.log("Token:", token); // Debugging statement
            console.log("User ID:", userId); // Debugging statement
            const response = await axios.post(
                `${MARKETER_API_END_POINT}/profiles/follow`,
                {
                    userId: userId,
                    followId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // JWT token for follow API
                    }
                }
            );
            console.log("Follow API response:", response.data); // Debugging statement
            setProfiles(profiles.map(profile =>
                profile.id === id ? { ...profile, isFollowing: true } : profile
            ));
        } catch (error) {
            console.error('Error following user:', error); // Debugging statement
        }
    };

    const handleProfileClick = (id) => {
        console.log(`Navigating to profile with ID: ${id}`); // Debugging statement
        navigate(`/marketer-profile/${id}`); // Navigate to individual profile
    };

    return (
        <div>
            <h1>All Profiles</h1>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id} onClick={() => handleProfileClick(profile.id)}>
                        {profile.fullname} - {profile.agencyName} ({profile.location})
                        <button onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click event
                            console.log(`Follow button clicked for profile ID: ${profile.id}`); // Debugging statement
                            handleFollow(profile.id);
                        }}>
                            {profile.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileList;
