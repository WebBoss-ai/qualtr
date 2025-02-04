import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MARKETER_API_END_POINT } from "@/utils/constant"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Users, Building, MapPin, Star, UserPlus, UserMinus, Mail, Clipboard, Loader } from 'lucide-react'

const Profiles = () => {
    const [profiles, setProfiles] = useState([])
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalAgencies: 0,
        suggestedCount: 0,
        totalFollowers: 0,
        totalFollowing: 0,
        topLocations: []
    })
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchProfiles()
    }, [])

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`${MARKETER_API_END_POINT}/admin/profiles`)
            setProfiles(response.data.profiles || [])
            setAnalytics(response.data.analytics || {
                totalUsers: 0,
                totalAgencies: 0,
                suggestedCount: 0,
                totalFollowers: 0,
                totalFollowing: 0,
                topLocations: []
            })
            setLoading(false)
        } catch (error) {
            console.error('Error fetching profiles:', error)
            setError('Error fetching profiles')
            setLoading(false)
        }
    }

    const fetchEmails = async () => {
        try {
            const response = await axios.get(`${MARKETER_API_END_POINT}/admin/emails`)
            setEmails(response.data.emails || [])
        } catch (error) {
            console.error('Error fetching emails:', error)
        }
    }

    const toggleSuggested = async (id) => {
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/admin/profiles/${id}/suggested`)
            setProfiles(profiles.map(profile =>
                profile.id === id
                    ? { ...profile, suggested: response.data.suggested }
                    : profile
            ))
        } catch (error) {
            console.error('Error toggling suggested status:', error)
        }
    }

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Total Users</h2>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Total Agencies</h2>
                            <Building className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{analytics.totalAgencies}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Suggested Users</h2>
                            <Star className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{analytics.suggestedCount}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Total Followers</h2>
                            <UserPlus className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{analytics.totalFollowers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Total Following</h2>
                            <UserMinus className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{analytics.totalFollowing}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-700">Top Locations</h2>
                            <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <ul className="space-y-1">
                            {(analytics.topLocations || []).map(loc => (
                                <li key={loc.location} className="text-sm text-gray-600">
                                    {loc.location}: <span className="font-medium text-gray-900">{loc.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Agency Name</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {profiles.length > 0 ? (
                                    profiles.map(profile => (
                                        <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">{profile.fullname || "Qualtr Member"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{profile.agencyName || "Building Something..."}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{profile.location || "Globe"}</td>

                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.suggested ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {profile.suggested ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => toggleSuggested(profile.id)}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    Toggle Suggested
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-sm text-gray-500 text-center">No profiles found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Copy Emails Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={fetchEmails}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Fetch Emails
                    </button>
                    {emails.length > 0 && (
                        <CopyToClipboard text={emails.join(", ")} onCopy={handleCopy}>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                <Clipboard className="w-4 h-4 mr-2" />
                                {copied ? 'Copied!' : 'Copy All Emails'}
                            </button>
                        </CopyToClipboard>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profiles