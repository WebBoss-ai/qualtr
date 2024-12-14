import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Menu, X, LogOut, BarChart2, Briefcase, Users, MessageSquare, Settings, PlusCircle } from 'lucide-react';
import AdminJobs from '../admin/AdminJobs';
import { useDispatch, useSelector } from 'react-redux'
import { ANALYTICS_API_END_POINT, JOB_ANALYTICS_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import AdminJobsTable from '../admin/AdminJobsTable';
import ApplicantsTable from '../admin/ApplicantsTable';
import Meetings from './Meetings';
import MainSection from './MainSection';
import { setUser } from '@/redux/authSlice'
import CompareAgencies from './CompareAgencies';

const BrandDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [analytics, setAnalytics] = useState({});
  const [activeJobs, setActiveJobs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

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
    { name: 'Dashboard', component: MainSection, icon: BarChart2 },
    { name: 'Projects', component: AdminJobsTable, icon: Briefcase },
    { name: 'Agencies', component: CompareAgencies, icon: Users },
    { name: 'Applicants', component: ApplicantsTable, icon: BarChart2 },
    { name: 'Messages', component: Meetings, icon: MessageSquare },
    { name: 'Settings', component: AdminJobs, icon: Settings },
  ];

  const renderSection = () => {
    const selectedItem = menuItems.find(item => item.name.toLowerCase() === selectedMenuItem);
    const SectionComponent = selectedItem ? selectedItem.component : null;
    return SectionComponent ? <SectionComponent analytics={analytics} activeJobs={activeJobs} /> : null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Helmet>
        <title>Brand Dashboard | Your Qualtr Business Insights</title>
        <meta name="description" content="Access your Qualtr brand dashboard for business insights, project tracking, and performance analysis." />
        <meta name="keywords" content="brand dashboard, business insights, project tracking, performance analysis, Qualtr analytics" />
      </Helmet>

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
        style={{
          background: 'linear-gradient(to bottom, #2C3E50, #34495E)',
          boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <a
            href="/"
            className="text-2xl font-bold text-white"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            onMouseEnter={(e) => (e.target.style.color = '#17B169')}
            onMouseLeave={(e) => (e.target.style.color = 'white')}
          >
            Qualtr
          </a>

          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white hover:text-gray-300 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 px-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`flex w-full items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${selectedMenuItem.toLowerCase() === item.name.toLowerCase()
                ? 'bg-white bg-opacity-10 text-white'
                : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                }`}
              onClick={() => setSelectedMenuItem(item.name.toLowerCase())}
              style={{
                transform: selectedMenuItem.toLowerCase() === item.name.toLowerCase() ? 'translateX(4px)' : 'none',
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
          {/* Logout Button */}
          <button
            className="flex w-full items-center space-x-3 px-4 py-3 mt-8 text-gray-300 transition-all duration-200 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 rounded-lg"
            onClick={logoutHandler}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
        <style jsx>{`
        /* Custom Scrollbar Styles */
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        aside::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        /* Hover Animation for Menu Items */
        button:hover {
          transform: translateX(4px);
        }
      `}</style>
      </aside>



      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{selectedMenuItem}</h1>
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 text-gray-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={() => window.location.href = '/admin/projects/create'}
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Project
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default BrandDashboard;
