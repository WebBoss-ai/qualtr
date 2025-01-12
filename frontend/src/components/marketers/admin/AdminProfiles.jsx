import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from "@/utils/constant";

const Profiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state to show loading spinner or message
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/admin/profiles`);
                setProfiles(response.data.profiles || []); // Ensures profiles is always an array
                setLoading(false); // Data fetched, so loading is false
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setError('Error fetching profiles'); // Set error state
                setLoading(false); // Data fetching completed, even with error
            }
        };

        fetchProfiles();
    }, []);

    const toggleSuggested = async (id) => {
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/admin/profiles/${id}/suggested`);
            setProfiles(profiles.map(profile =>
                profile.id === id
                    ? { ...profile, suggested: response.data.suggested }
                    : profile
            ));
        } catch (error) {
            console.error('Error toggling suggested status:', error);
        }
    };

    return (
        <div>
            <h1>User Profiles</h1>
            {loading ? (
                <p>Loading...</p> // Loading message while data is being fetched
            ) : error ? (
                <p>{error}</p> // Error message if there's an issue fetching profiles
            ) : profiles.length === 0 ? (
                <p>No profiles available</p> // Message when no profiles are available
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Agency Name</th>
                            <th>Location</th>
                            <th>Suggested</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map(profile => (
                            <tr key={profile.id}>
                                <td>{profile.fullname}</td>
                                <td>{profile.agencyName}</td>
                                <td>{profile.location}</td>
                                <td>{profile.suggested ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => toggleSuggested(profile.id)}>
                                        Toggle Suggested
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Profiles;
