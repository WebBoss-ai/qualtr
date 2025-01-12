// components/RandomSuggestedProfiles.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const RandomSuggestedProfiles = () => {
    const [profiles, setProfiles] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profiles/random-suggested`);
                setProfiles(response.data.profiles || []); // Ensure it's always an array
            } catch (error) {
                setError('Failed to fetch profiles.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="profiles-container">
            {profiles.length === 0 ? (
                <p>No suggested profiles found.</p>
            ) : (
                <div className="profile-cards">
                    {profiles.map(profile => (
                        <div key={profile.id} className="profile-card">
                            <img
                                src={profile.profilePhoto || '/default-profile.jpg'}
                                alt={profile.fullname}
                                className="profile-photo"
                            />
                            <h3>{profile.fullname}</h3>
                            <p>{profile.agencyName}</p>
                            <p>{profile.location}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RandomSuggestedProfiles;
