import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from '@/utils/constant';
import { Search, Users, SchoolIcon as Student, Briefcase } from 'lucide-react';

export default function SplitUserManagementDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/users-by-role`);
                setUsers(response.data.users || []);
            } catch (err) {
                setError("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const students = filteredUsers.filter(user => user.role === 'student');
    const recruiters = filteredUsers.filter(user => user.role === 'recruiter');

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#17B169]"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        </div>
    );

    const UserTable = ({ users, title, icon: Icon }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-8rem)]">
            <div className="bg-[#006241] text-white px-6 py-4 flex items-center sticky top-0 z-10">
                <Icon className="mr-2" />
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-[#17B169] hover:text-[#006241] transition-colors duration-200">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">User Management Dashboard</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#17B169] focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                        <UserTable users={students} title="Agencies" icon={Student} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <UserTable users={recruiters} title="Brands" icon={Briefcase} />
                    </div>
                </div>
            </div>
        </div>
    );
}