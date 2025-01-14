import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import TrendingPosts from './post/TrendingPosts';

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">You need to log in</h2>
                <p className="text-gray-600 mb-6">Please log in to follow profiles or view details.</p>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                        onClick={() => (window.location.href = '/marketer/login')}
                    >
                        Login
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded-lg" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null); // Authentication state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            setUser({ id: userId, token });
        }

        const fetchProfiles = async () => {
            try {
                if (!token) {
                    return;
                }

                const response = await axios.get(`${MARKETER_API_END_POINT}/profiles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfiles(response.data.profiles);
            } catch (error) {
                console.error('Error fetching profiles:', error.response?.data || error.message);
            }
        };

        fetchProfiles();
    }, []);

    const handleFollow = async (id) => {
        if (!user) {
            setIsModalOpen(true);
            return;
        }

        try {
            const response = await axios.post(
                `${MARKETER_API_END_POINT}/profiles/follow`,
                { userId: user.id, followId: id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setProfiles((prevProfiles) =>
                prevProfiles.map((profile) => {
                    if (profile.id === id) {
                        return {
                            ...profile,
                            isFollowing: true,
                            followers: profile.followers + 1,
                        };
                    }
                    return profile;
                })
            );
        } catch (error) {
            console.error('Error following user:', error.response?.data || error.message);
        }
    };

    const handleProfileClick = (id) => {
        if (!user) {
            setIsModalOpen(true);
            return;
        }

        navigate(`/marketer-profile/${id}`);
    };

    return (
        <div>
            <h1>All Profiles</h1>
            <ul>
                {profiles.map((profile) => (
                    <li key={profile.id} onClick={() => handleProfileClick(profile.id)}>
                        <div>
                            <strong>{profile.fullname}</strong> - {profile.agencyName} ({profile.location})
                        </div>
                        <div>Followers: {profile.followers}</div>
                        <button
                            disabled={profile.isFollowing}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFollow(profile.id);
                            }}
                            className={`px-4 py-2 rounded-lg ${profile.isFollowing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                        >
                            {profile.isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </li>
                ))}
            </ul>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <TrendingPosts />
        </div>
    );
};

export default ProfileList;