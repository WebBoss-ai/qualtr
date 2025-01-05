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

    const handleProfileClick = (id) => {
        navigate(`/profile/${id}`); // Navigate to individual profile
    };

    return (
        <div>
            <h1>All Profiles</h1>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id} onClick={() => handleProfileClick(profile.id)}>
                        {profile.fullname} - {profile.agencyName} ({profile.location})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileList;
