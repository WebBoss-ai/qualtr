import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

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
            console.log('User authenticated:', { userId, token });
        } else {
            console.warn('User not authenticated. Token or userId missing.');
        }

        const fetchProfiles = async () => {
            try {
                if (!token) {
                    console.warn('No token found. Skipping profile fetch.');
                    return;
                }

                const response = await axios.get(`${MARKETER_API_END_POINT}/profiles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Fetched profiles:', response.data.profiles);
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

        console.log(`Attempting to follow user with ID: ${id}`);
        try {
            const response = await axios.post(
                `${MARKETER_API_END_POINT}/profiles/follow`,
                { userId: user.id, followId: id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            console.log(`Successfully followed user with ID: ${id}`, response.data);

            setProfiles((prevProfiles) =>
                prevProfiles.map((profile) => {
                    if (profile.id === id) {
                        console.log(`Updating profile with ID: ${id}`, { ...profile, isFollowing: true });
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

        console.log(`Navigating to profile with ID: ${id}`);
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
                            <div>
                                {profile.profilePhoto && (
                                    <img
                                        src={profile.profilePhoto}
                                        alt={profile.fullname}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div>Followers: {profile.followers}</div>
                        <div>isFollowing: {profile.isFollowing ? 'Yes' : 'No'}</div>
                        <button
                            disabled={profile.isFollowing}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFollow(profile.id);
                            }}
                            className={`px-4 py-2 rounded-lg ${
                                profile.isFollowing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'
                            }`}
                        >
                            {profile.isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <div>
                            <h3>Posts:</h3>
                            {profile.posts && profile.posts.length > 0 ? (
                                profile.posts.map((post) => (
                                    <div key={post._id}>
                                        {post.text && <p>{post.text}</p>}
                                        {post.category && <p>Category: {post.category}</p>}
                                        {post.media?.photos?.length > 0 && (
                                            <div>
                                                {post.media.photos.map((photo, index) => (
                                                    <img key={index} src={photo.url} alt={`Photo ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                                                ))}
                                            </div>
                                        )}
                                        {post.media?.videos?.length > 0 && (
                                            <div>
                                                {post.media.videos.map((video, index) => (
                                                    <video key={index} width="300" controls>
                                                        <source src={video.url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No posts available</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProfileList;