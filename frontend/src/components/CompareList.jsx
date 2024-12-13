import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate the total pages
    const totalPages = Math.ceil(compareList.length / itemsPerPage);
    // Get the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = compareList.slice(indexOfFirstItem, indexOfLastItem);
    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                <div className="w-full mt-8 p-4">
                    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-white border-none shadow-lg rounded-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="flex flex-col md:flex-row items-center gap-6 p-6 relative">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
                                    <Search className="w-4 h-4" />
                                    <span>Premium Agency Matching</span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    Find your matching agency - Premium
                                </h2>

                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    Our expert marketing consultants will meet with you to understand your unique marketing needs and recommend the best-fit agencies tailored to your goals.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="group bg-[#17B169] hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all duration-300 hover:shadow-md flex items-center"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Get Started
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={openModal}
                                        className="group bg-white text-[#17B169] border border-emerald-200 hover:border-emerald-300 px-4 py-2 rounded text-sm font-semibold transition-all duration-300 flex items-center"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Learn More
                                        <Users className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 relative">
                                <div className="absolute inset-0 animate-float">
                                    <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#17B169] rounded-xl transform rotate-45 opacity-80" />
                                    <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-emerald-400 rounded-xl transform -rotate-12 opacity-80" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg">
                                        <Target className="w-8 h-8 text-[#17B169]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-2 right-4 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            $99 - Pay after deal
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full relative animate-fade-in">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">About Our Agency Matching Service</h3>
                                <p className="text-gray-600 mb-6">
                                    Our agency matching service is designed to connect you with the perfect agency for your needs. We take into account your project requirements, budget, and preferences to provide tailored recommendations. Our expert team conducts thorough vetting of agencies to ensure quality and reliability.
                                </p>
                                <button
                                    className="w-full bg-[#17B169] hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all duration-300 hover:shadow-md"
                                    style={{ borderRadius: '2px' }}
                                    onClick={() => navigate('/agencies')}
                                >
                                    Explore All Agencies
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
                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Compare Agencies</h2>
                {currentItems.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">
                        No agencies added to the compare list yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((agency) => (
                            <div key={agency._id} className="bg-white rounded-xl overflow-hidden transition-all duration-300">
                                {/* Agency Card Code */}
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden">
                                            <a href={`/agency/${agency._id}`}>
                                                <img
                                                    src={agency.profile.profilePhoto || "https://via.placeholder.com/40"}
                                                    alt={`${agency.profile.agencyName || "Agency"} logo`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </a>
                                        </div>
                                        <div>
                                            <a href={`/agency/${agency._id}`}>
                                                <h3 className="text-2xl font-bold text-gray-900 hover:text-[#17B169] transition-colors duration-200">
                                                    {agency.profile.agencyName}
                                                </h3>
                                            </a>
                                            <p className="text-sm text-gray-600 italic mt-1">{agency.profile.slogan}</p>
                                        </div>
                                    </div>
                                    {/* Other Agency Details */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Pagination Controls */}
                <div className="flex justify-center mt-8">
                    <ul className="flex items-center space-x-2">
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#17B169] text-white hover:bg-[#149655]"}`}
                            >
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-[#17B169] text-white" : "bg-gray-200 hover:bg-[#149655] hover:text-white"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#17B169] text-white hover:bg-[#149655]"
                                    }`}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default CompareList;