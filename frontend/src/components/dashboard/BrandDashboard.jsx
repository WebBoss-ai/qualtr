import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Menu, X, Eye, BarChart2, Briefcase, Users, MessageSquare, Settings, PlusCircle } from 'lucide-react';
import { ANALYTICS_API_END_POINT } from '@/utils/constant';
import { JOB_ANALYTICS_API_END_POINT } from '@/utils/constant';

const BrandDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [analytics, setAnalytics] = useState({});
  const [activeJobs, setActiveJobs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const analyticsResponse = await axios.get(`${ANALYTICS_API_END_POINT}`);
        setAnalytics(analyticsResponse.data);

        const jobsResponse = await axios.get(`${JOB_ANALYTICS_API_END_POINT}`);
        const jobsData = Array.isArray(jobsResponse.data) ? jobsResponse.data : [];
        setActiveJobs(jobsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setActiveJobs([]);
      }
    }
    fetchData();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: BarChart2 },
    { name: 'Projects', icon: Briefcase },
    { name: 'Agencies', icon: Users },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Helmet>
  <title>Brand Dashboard | Your Qualtr Business Insights</title>
  <meta name="description" content="Access your Qualtr brand dashboard for business insights, project tracking, and performance analysis." />
  <meta name="keywords" content="brand dashboard, business insights, project tracking, performance analysis, Qualtr analytics" />
</Helmet>


      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Qualtr</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`flex w-full items-center space-x-2 px-4 py-3 transition-colors ${
                selectedMenuItem.toLowerCase() === item.name.toLowerCase()
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setSelectedMenuItem(item.name.toLowerCase())}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 text-gray-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button  onClick={() => window.location.href = '/login'} className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Project
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Analytics Overview</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total Requirements', value: analytics.totalRequirements || 0, color: 'bg-blue-500' },
                { label: 'Active Bids', value: analytics.activeBids || 0, color: 'bg-green-500' },
                { label: 'Agencies Contacted', value: analytics.agenciesContacted || 0, color: 'bg-yellow-500' },
                { label: 'Average Bid Amount', value: `₹${(analytics.averageBidAmount || 0).toLocaleString()}`, color: 'bg-purple-500' },
              ].map((stat, index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-white shadow">
                  <div className={`p-3 ${stat.color}`} />
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Top 5 Active Projects</h2>
            {activeJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {activeJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {job.title.length > 30 ? `${job.title.substring(0, 30)}...` : job.title}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{job.category.join(', ')}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => navigate(`/admin/projects/${job._id}/applicants`)}
                            className="flex items-center text-green-600 hover:text-green-900"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No active projects available.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default BrandDashboard;