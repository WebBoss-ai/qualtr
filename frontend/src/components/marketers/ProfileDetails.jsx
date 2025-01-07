import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const ProfileDetails = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT token
                    },
                });
                setProfile(response.data.profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [id]);

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Profile Details</h1>
            {profile.profilePhoto && (
                <div>
                    <img
                        src={profile.profilePhoto}
                        alt={`${profile.fullname}'s Profile`}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            )}
            <p><strong>Full Name:</strong> {profile.fullname}</p>
            <p><strong>Agency Name:</strong> {profile.agencyName}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Skills:</strong> {profile.skills}</p>
        </div>
    );
};

export default ProfileDetails;
