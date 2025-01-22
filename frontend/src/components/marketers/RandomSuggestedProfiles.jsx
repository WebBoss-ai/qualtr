import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { MARKETER_API_END_POINT } from "@/utils/constant"

const ProfileSkeleton = () => (
    <div className="animate-pulse flex space-x-4 p-4 border-b border-gray-200">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-1">
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    </div>
)

const RandomSuggestedProfiles = () => {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/random-suggested`)
                setProfiles(response.data.profiles || [])
            } catch (err) {
                setError('Failed to fetch profiles.')
            } finally {
                setLoading(false)
            }
        }

        fetchProfiles()
    }, [])

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg">
                <p className="text-gray-700 text-center py-4">{error}</p>
            </div>
        )
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">People you may know</h2>
            </div>
            {loading ? (
                <>
                    <ProfileSkeleton />
                    <ProfileSkeleton />
                    <ProfileSkeleton />
                </>
            ) : profiles.length === 0 ? (
                <p className="text-gray-700 text-center py-4">No suggested profiles found.</p>
            ) : (
                <div className="divide-y divide-gray-200">
                    {profiles.map(profile => (
                        <div key={profile.id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center space-x-4">
                                {/* Profile picture wrapped in <a> tag */}
                                <a href={`https://qualtr.com/marketer-profile/${profile.id}`} className="flex-shrink-0">
                                    <img
                                        src={profile.profilePhoto || '/default-profile.jpg'}
                                        alt={profile.fullname}
                                        className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                    />
                                </a>

                                <div className="flex-1 min-w-0">
                                    {/* Fullname wrapped in <a> tag with hover underline effect */}
                                    <a
                                        href={`https://qualtr.com/marketer-profile/${profile.id}`}
                                        className="text-sm font-medium text-gray-900 truncate hover:underline"
                                    >
                                        {profile.fullname}
                                    </a>
                                    <p className="text-sm text-gray-600 truncate">{profile.agencyName}</p>
                                    <p className="text-xs text-gray-500 truncate">{profile.location}</p>
                                    {profile.connectionDegree && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {profile.connectionDegree} • {profile.mutualConnections} mutual connections
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}
            {profiles.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 text-center">
                    <a
                        href="/founder/profiles"  // Use href for simple redirection
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out"
                    >
                        View more
                    </a>
                </div>
            )}
        </div>
    )
}

RandomSuggestedProfiles.propTypes = {
    profiles: PropTypes.array,
}

export default RandomSuggestedProfiles
