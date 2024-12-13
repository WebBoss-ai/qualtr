import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin } from 'lucide-react';
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import { Search, ArrowRight, X, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const CompareList = () => {
    const [compareList, setCompareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAgencies, setExpandedAgencies] = useState({});
    const [expandedPortfolios, setExpandedPortfolios] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    useEffect(() => {
        const fetchCompareList = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${USER_API_END_POINT}/compare`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                setCompareList(response.data.compareList || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching compare list:", err);
                setError("Failed to fetch compare list. Please try again.");
                setLoading(false);
            }
        };

        fetchCompareList();
    }, []);

    const toggleAgencyDetails = (agencyId) => {
        setExpandedAgencies(prevState => ({
            ...prevState,
            [agencyId]: !prevState[agencyId]
        }));
    };

    const togglePortfolioDetails = (portfolioId) => {
        setExpandedPortfolios(prevState => ({
            ...prevState,
            [portfolioId]: !prevState[portfolioId]
        }));
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-[#17B169]" />
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-12 bg-gray-50">
                <div className="w-full mt-6 mb-6 p-4">
                    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl mb-16">
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
                                    <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg flex items-center space-x-2">
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="group bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
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
                    {isModalOpen && (
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
                                    onClick={() => navigate("/agencies")}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <span>Explore All Agencies</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                            </div>
                        </div>
                    )}

                    <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
                </div>
                <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">Compare Agencies</h3>
                {compareList.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No agencies added to the compare list yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {compareList.map((agency) => (
                            <div key={agency._id} className="bg-white rounded-xl overflow-hidden border border-gray-700 border-1 transition-all duration-300">
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
                                                <MapPin className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span>{agency.profile.location} Average Rating</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <Award className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span>
                                                    {agency.profile.yearFounded
                                                        ? `${new Date().getFullYear() - agency.profile.yearFounded} Years Experience`
                                                        : "Experience not available"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Briefcase className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span>{agency.profile.portfolio.length} Portfolio Listed</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span>{agency.profile.numberOfEmployees} Team Members</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>

    );
};

export default CompareList;