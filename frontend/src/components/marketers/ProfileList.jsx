import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

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
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            await axios.post(
                `${MARKETER_API_END_POINT}/profiles/follow`,
                { userId, followId: id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setProfiles(profiles.map(profile =>
                profile.id === id ? { ...profile, isFollowing: true } : profile
            ));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    return (
        <div>
            <h1>All Profiles</h1>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id}>
                        {profile.fullname} - {profile.agencyName} ({profile.location})
                        <button onClick={() => handleFollow(profile.id)}>
                            {profile.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileList;
