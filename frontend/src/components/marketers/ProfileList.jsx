import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profiles`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Add JWT token
                    }
                });
                setProfiles(response.data.profiles);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, []);

    const handleFollow = async (id) => {
        try {
            await axios.post(
                `${MARKETER_API_END_POINT}/profiles/follow`,
                {
                    userId: localStorage.getItem('userId'),
                    followId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // JWT token for follow API
                    }
                }
            );
            setProfiles(profiles.map(profile =>
                profile.id === id ? { ...profile, isFollowing: true } : profile
            ));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleProfileClick = (id) => {
        navigate(`/marketer-profile/${id}`); // Navigate to individual profile
    };

    return (
        <div>
            <h1>All Profiles</h1>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id} onClick={() => handleProfileClick(profile.id)}>
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
