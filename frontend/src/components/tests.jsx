import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { JOB_SEEKER_API_END_POINT } from "@/utils/constant";
import { Star, Globe, DollarSign, Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Badge } from './ui/badge';

const CompactHome2 = () => {
    const [randomJobSeekers, setRandomJobSeekers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${JOB_SEEKER_API_END_POINT}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const shuffledJobSeekers = data.jobSeekers.sort(() => 0.5 - Math.random());
                    setRandomJobSeekers(shuffledJobSeekers.slice(0, 6));
                }
            })
            .catch((error) => console.error("Error fetching job seekers:", error))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Featured Agencies | Qualtr</title>
            </Helmet>
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Agencies</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {randomJobSeekers.map((jobSeeker) => (
                            <div
                                key={jobSeeker._id}
                                className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:border-[#17B169] transition-border duration-300"
                            >
                                <div className="p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            <a href={`/agency/${jobSeeker._id}`}>
                                                <img
                                                    src={jobSeeker.profile.profilePhoto || "https://via.placeholder.com/40"}
                                                    alt={`${jobSeeker?.profile?.agencyName || "Agency"} logo`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </a>
                                        </div>
                                        <div>
                                            <a href={`/agency/${jobSeeker._id}`}>
                                                <h2 className="text-lg font-semibold text-gray-900 leading-tight hover:text-[#17B169] transition-colors duration-200">
                                                    {(jobSeeker?.profile?.agencyName?.slice(0, 20) || "Unknown Agency")}
                                                </h2>
                                            </a>
                                            <p className="text-sm text-gray-500 truncate">
                                                {(jobSeeker?.profile?.slogan?.slice(0, 30) + "..." || "Innovating for tomorrow")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div className="flex items-center text-gray-700">
                                            <Globe className="h-4 w-4 text-green-500 mr-1" />
                                            <span>Year Founded: {jobSeeker?.profile?.yearFounded || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <MapPin className="h-4 w-4 text-red-500 mr-1" />
                                            <span className="truncate">{jobSeeker.profile.location || "Remote"}</span>
                                        </div>
                                        <div className="col-span-2 rounded-lg" style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}>
                                            <div className="flex gap-2 mt-3">
                                                {jobSeeker?.profile?.expertise?.length ? (
                                                    jobSeeker?.profile?.expertise.slice(-5).map((expertise, index) => (
                                                        <Badge key={index} className="border border-gray-400 font-light bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200">
                                                            {expertise}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">No expertise listed.</span>
                                                )}
                                            </div>
                                        </div>

                                        <style jsx>{`
                                            /* Hide scrollbar */
                                            .col-span-2::-webkit-scrollbar {
                                                display: none;
                                            }

                                            /* Smooth scrolling behavior */
                                            .col-span-2 {
                                                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                                                scrollbar-width: none;  /* Firefox */
                                            }
                                        `}</style>

                                    </div>
                                    <a
                                        href={`/agency/${jobSeeker._id}`}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md hover:text-[#006241] text-[#17B169] bg-green-100 hover:bg-green-200 transition-colors duration-200"
                                    >
                                        View Profile
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <a
                        href="/agencies"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Explore All Agencies
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CompactHome2;


import React, { useState } from 'react';
import { X, LogIn, Mail } from 'lucide-react';

const EnhancedDiscussProjectButton = ({ user, handleMailClick }) => {
    const [showModal2, setShowModal2] = useState(false);

    const handleClick2 = () => {
        if (!user) {
            setShowModal2(true);
            setTimeout(() => {
                setShowModal2(false);
                window.location.href = '/login';
            }, 3000);
        } else {
            handleMailClick();
        }
    };

    return (
        <div className="relative">
            <button
                className="px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={handleClick2}
            >
                Discuss Project
            </button>

            {showModal2 && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={() => setShowModal2(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Mail className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Let's Create Something Amazing!
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                To discuss your project or schedule a meeting, please log in to unlock the next step. We're excited to hear about your ideas!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    <LogIn className="h-5 w-5 mr-2" aria-hidden="true" />
                                    Log In Now
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal2(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedDiscussProjectButton;




import React, { useState, useEffect } from 'react'
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin, Calendar, DollarSign, Star, Search, ArrowRight, X, Target } from 'lucide-react'

export default function EnhancedCompareList() {
  const [compareList, setCompareList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedAgencies, setExpandedAgencies] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchCompareList = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockData = [
          { _id: '1', profile: { agencyName: 'Digital Dynamos', profilePhoto: 'https://picsum.photos/seed/agency1/200' } },
          { _id: '2', profile: { agencyName: 'Creative Catalysts', profilePhoto: 'https://picsum.photos/seed/agency2/200' } },
          { _id: '3', profile: { agencyName: 'Marketing Mavericks', profilePhoto: 'https://picsum.photos/seed/agency3/200' } },
        ]
        setCompareList(mockData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching compare list:", err)
        setError("Failed to fetch compare list. Please try again.")
        setLoading(false)
      }
    }

    fetchCompareList()
  }, [])

  const toggleAgencyDetails = (agencyId) => {
    setExpandedAgencies(prev => ({ ...prev, [agencyId]: !prev[agencyId] }))
  }

  const renderHeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-2xl mb-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
            <Search className="w-4 h-4" />
            <span>Premium Agency Matching</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Find your perfect <span className="text-emerald-600">agency match</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Our expert marketing consultants will meet with you to understand your unique needs and recommend the best-fit agencies tailored to your goals.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="group bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              <span>Learn More</span>
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-64 h-64 lg:w-80 lg:h-80 relative">
          <div className="absolute inset-0 animate-float">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-500 rounded-2xl transform rotate-45 opacity-80" />
            <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-teal-400 rounded-2xl transform -rotate-12 opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-full shadow-xl">
              <Target className="w-20 h-20 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-8 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-lg font-semibold animate-pulse">
        $99 - Pay after successful match
      </div>
    </div>
  )

  const renderAgencyCard = (agency) => (
    <div key={agency._id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
      <div className="p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-emerald-200 shadow-md">
            <img
              src={agency.profile.profilePhoto}
              alt={`${agency.profile.agencyName} logo`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-200">
              {agency.profile.agencyName}
            </h4>
            <p className="text-emerald-600 font-medium">Top Rated Agency</p>
          </div>
        </div>
        <button
          onClick={() => toggleAgencyDetails(agency._id)}
          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {expandedAgencies[agency._id] ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="ml-2 w-5 h-5" />
            </>
          ) : (
            <>
              <span>Show Details</span>
              <ChevronDown className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
        {expandedAgencies[agency._id] && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="flex items-center text-gray-600">
              <Award className="w-5 h-5 mr-3 text-emerald-500" />
              <span>5+ Years Experience</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-5 h-5 mr-3 text-emerald-500" />
              <span>100+ Projects Completed</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 text-emerald-500" />
              <span>50+ Team Members</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Star className="w-5 h-5 mr-3 text-emerald-500" />
              <span>4.9/5 Average Rating</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative animate-fade-in">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">About Our Agency Matching Service</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Our premium agency matching service is designed to connect you with the perfect agency for your unique needs. We take into account your project requirements, budget, and preferences to provide tailored recommendations. Our expert team conducts thorough vetting of agencies to ensure quality and reliability.
        </p>
        <button
          onClick={() => setIsModalOpen(false)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <span>Explore All Agencies</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-emerald-50 to-teal-50">
      <Loader2 className="w-16 h-16 animate-spin text-emerald-600" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-50 to-pink-50">
      <p className="text-red-600 text-xl font-semibold bg-white px-8 py-6 rounded-lg shadow-lg">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-teal-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {renderHeroSection()}

        <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">Compare Top Agencies</h3>
        
        {compareList.length === 0 ? (
          <p className="text-center text-gray-600 text-xl bg-white p-8 rounded-xl shadow-md">No agencies added to the compare list yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {compareList.map(renderAgencyCard)}
          </div>
        )}
      </div>

      {isModalOpen && renderModal()}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Menu, X, Eye, BarChart2, Briefcase, Users, MessageSquare, Settings, PlusCircle } from 'lucide-react';
import { ANALYTICS_API_END_POINT } from '@/utils/constant';
import { JOB_ANALYTICS_API_END_POINT } from '@/utils/constant';
import { ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

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
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
              className={`flex w-full items-center space-x-2 px-4 py-3 transition-colors ${selectedMenuItem.toLowerCase() === item.name.toLowerCase()
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
              <button onClick={() => window.location.href = '/login'} className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Project
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Compare List', value: analytics.comparedAgencies || 0, icon: Briefcase, color: 'bg-blue-500', trend: analytics.percentChangeComparedAgencies },
              { label: 'Meeting Request', value: analytics.messagesRequested || 0, icon: Users, color: 'bg-yellow-500', trend: analytics.percentChangeMessagesRequested },
              { label: 'Active Bids', value: analytics.activeBids || 0, icon: BarChart2, color: 'bg-green-500', trend: analytics.percentChangeActiveBids },
              { label: 'Average Bid Amount', value: `₹${(analytics.averageBidAmount || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', trend: analytics.percentChangeAverageBidAmount },
            ].map((stat, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-white shadow transition-all duration-300">
                <div className={`p-1 ${stat.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <dd className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</dd>
                  {stat.trend !== undefined && (
                    <div className={`mt-2 flex items-center text-sm ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                      <span>{Math.abs(stat.trend)}% {stat.trend >= 0 ? 'increase' : 'decrease'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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



const handleEditExperiences = (experiences) => {
  setSelectedExperiences(experiences); // Store the experience in a state
  setModalOpen1(true); // Open the modal
};

const handleDeleteExperiences = async (id) => {
  try {
      const res = await axios.delete(`${MARKETER_API_END_POINT}/experiences/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData((prevData) => ({
          ...prevData,
          experiences: prevData.experiences.filter((exp) => exp._id !== id),
      }));
      alert(res.data.message || 'Experience deleted successfully.');
  } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete experience.');
  }
};

const handleEditEducation = (education) => {
  setSelectedEducation(education); // Store the education in a state
  setModalOpen2(true); // Open the modal
};

const handleDeleteEducation = async (id) => {
  try {
      const res = await axios.delete(`${MARKETER_API_END_POINT}/education/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData((prevData) => ({
          ...prevData,
          education: prevData.education.filter((edu) => edu._id !== id),
      }));
      alert(res.data.message || 'Education deleted successfully.');
  } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete education.');
  }
};