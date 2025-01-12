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
            console.log("Fetching random suggested profiles...");
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/random-suggested`);
                console.log("API response:", response.data);

                // Ensure it's always an array
                setProfiles(response.data.profiles || []);
                console.log(`Fetched ${response.data.profiles?.length || 0} profiles.`);
            } catch (err) {
                console.error("Error fetching profiles:", err);
                setError('Failed to fetch profiles.');
            } finally {
                setLoading(false);
                console.log("Fetching profiles complete. Loading state set to false.");
            }
        };

        fetchProfiles();
    }, []);

    if (loading) {
        console.log("Component is in loading state...");
        return <p>Loading...</p>;
    }

    if (error) {
        console.log("Error occurred:", error);
        return <p>{error}</p>;
    }

    console.log(`Rendering ${profiles.length} profiles...`);

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
