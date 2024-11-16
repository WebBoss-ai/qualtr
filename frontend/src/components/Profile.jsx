import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mail, Briefcase, User, Settings, LogOut, ChevronRight, BarChart2, PieChart, TrendingUp, Users, Bookmark, Folder, Menu, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import UpdateProfilePage from './UpdateProfilePage';
import AddPortfolio from './AddPortfolio';
import SavedJobs from './SavedJobs';

const ProfileDashboard = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { allAppliedJobs } = useSelector((store) => store.job);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const totalApplications = allAppliedJobs.length;
    const acceptedApplications = allAppliedJobs.filter(job => job.status === 'accepted').length;
    const pendingApplications = allAppliedJobs.filter(job => job.status === 'pending').length;
    const rejectedApplications = allAppliedJobs.filter(job => job.status === 'rejected').length;
    const successRate = totalApplications > 0 ? ((acceptedApplications / totalApplications) * 100).toFixed(2) : 0;

    const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

    const sidebarItems = [
        { icon: User, label: 'Overview', value: 'overview' },
        { icon: Users, label: 'My Agency', value: 'my-agency' },
        { icon: Folder, label: 'Portfolios', value: 'portfolios' },
        { icon: Briefcase, label: 'Recent Bids', value: 'applied' },
        { icon: Bookmark, label: 'Saved Projects', value: 'saved' },
        { icon: BarChart2, label: 'Analytics', value: 'analytics' },
        { icon: Settings, label: 'Settings', value: 'settings' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                const pieData = [
                    { name: 'Accepted', value: acceptedApplications },
                    { name: 'Pending', value: pendingApplications },
                    { name: 'Rejected', value: rejectedApplications },
                ];
                const monthlyData = [
                    { name: 'Jan', applications: 4, accepted: 1 },
                    { name: 'Feb', applications: 3, accepted: 2 },
                    { name: 'Mar', applications: 2, accepted: 1 },
                    { name: 'Apr', applications: 6, accepted: 3 },
                    { name: 'May', applications: 8, accepted: 4 },
                    { name: 'Jun', applications: 5, accepted: 2 },
                ];

                return (
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700">{user?.fullname}</h3>
                                        <p className="text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{user?.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">{user?.profile?.location || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bio</p>
                                    <p className="text-gray-700">{user?.profile?.bio || 'No bio available'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Application Status</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Monthly Applications</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="accepted" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Status Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="applications" fill="#8884d8" />
                                    <Bar dataKey="accepted" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'applied':
                return <AppliedJobTable />;
            case 'analytics':
                const monthlyData2 = [
                    { name: 'Jan', applications: 4, accepted: 1 },
                    { name: 'Feb', applications: 3, accepted: 2 },
                    { name: 'Mar', applications: 2, accepted: 1 },
                    { name: 'Apr', applications: 6, accepted: 3 },
                    { name: 'May', applications: 8, accepted: 4 },
                    { name: 'Jun', applications: 5, accepted: 2 },
                ];
                return (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Application Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <PieChart className="w-8 h-8 text-green-500 mb-2" />
                                <h3 className="font-semibold text-lg text-green-700">Application Status</h3>
                                <p className="text-sm text-green-600">{pendingApplications} Pending, {acceptedApplications} Accepted, {rejectedApplications} Rejected</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                                <h3 className="font-semibold text-lg text-green-700">Success Rate</h3>
                                <p className="text-sm text-green-600">{successRate}% Bid Selection Rate</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <Users className="w-8 h-8 text-purple-500 mb-2" />
                                <h3 className="font-semibold text-lg text-purple-700">Top Skills in Demand</h3>
                                <p className="text-sm text-purple-600">SEO, PPC, Influencer Marketing</p>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData2}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="accepted" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'my-agency':
                return <UpdateProfilePage />;
            case 'portfolios':
                return <AddPortfolio />;
            case 'saved':
                return <SavedJobs />;
            case 'settings':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Settings</h2>
                        <Button onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                            Update Profile
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <Helmet>
  <title>Your Profile | Manage Your Qualtr Account & Portfolio</title>
  <meta name="description" content="Manage your Qualtr account, update your portfolio, and showcase your expertise to potential partners." />
  <meta name="keywords" content="profile management, update portfolio, Qualtr account, professional profile, online portfolio, user account settings, profile customization, career showcase" />
</Helmet>

            <aside
                className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white shadow-md transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold">Qualtr</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                            <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold">{user?.fullname}</h2>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.value}
                                className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
                                    activeTab === item.value
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                                onClick={() => setActiveTab(item.value)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="absolute bottom-4 left-4">
                    <button
                        className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                        onClick={() => {/* Implement logout logic */}}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <button
                
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                    {renderContent()}
                </div>
            </main>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default ProfileDashboard;