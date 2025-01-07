import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const ProfileDetails = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT token
                    },
                });
                if (response.data.success) {
                    setProfile(response.data.profile);
                } else {
                    setError(response.data.message || 'Error fetching profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('An error occurred while fetching the profile.');
            }
        };

        fetchProfile();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

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
            <p><strong>Skills:</strong> {profile.skills?.join(', ')}</p>

            <h3>Experiences</h3>
            {profile.experiences && profile.experiences.length > 0 ? (
                <ul>
                    {profile.experiences.map((exp, index) => (
                        <li key={index}>
                            <p><strong>Title:</strong> {exp.title}</p>
                            <p><strong>Company:</strong> {exp.company}</p>
                            <p><strong>Employment Type:</strong> {exp.employmentType}</p>
                            <p><strong>Location:</strong> {exp.location} ({exp.locationType})</p>
                            <p><strong>Duration:</strong> 
                                {exp.startDate.month} {exp.startDate.year} - 
                                {exp.isCurrent ? 'Present' : `${exp.endDate?.month} ${exp.endDate?.year}`}
                            </p>
                            {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No experiences listed.</p>
            )}

            <h3>Education</h3>
            {profile.education && profile.education.length > 0 ? (
                <ul>
                    {profile.education.map((edu, index) => (
                        <li key={index}>
                            <p><strong>School:</strong> {edu.school}</p>
                            <p><strong>Degree:</strong> {edu.degree}</p>
                            <p><strong>Field of Study:</strong> {edu.fieldOfStudy}</p>
                            <p><strong>Grade:</strong> {edu.grade || 'N/A'}</p>
                            <p><strong>Duration:</strong> 
                                {edu.startDate?.month} {edu.startDate?.year} - 
                                {edu.endDate?.month} {edu.endDate?.year}
                            </p>
                            {edu.activitiesAndSocieties && (
                                <p><strong>Activities and Societies:</strong> {edu.activitiesAndSocieties}</p>
                            )}
                            {edu.description && <p><strong>Description:</strong> {edu.description}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No education listed.</p>
            )}
        </div>
    );
};

export default ProfileDetails;
