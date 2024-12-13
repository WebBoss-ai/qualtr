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

            <div className="w-full p-4">
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

            <div className="container mx-auto px-4 py-12 bg-gray-50">
                <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Compare Agencies</h1>
                {compareList.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No agencies added to the compare list yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {compareList.map((agency) => (
                            <div key={agency._id} className="bg-white rounded-xl overflow-hidden transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden">
                                            <a href={`/agency/${agency._id}`}>
                                                <img
                                                    src={agency.profile.profilePhoto || "https://via.placeholder.com/40"}
                                                    alt={`${agency.profil.agencyName || "Agency"} logo`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </a>
                                        </div>
                                        <div>
                                            <a href={`/agency/${agency._id}`}>
                                                <h3 className="text-2xl font-bold text-gray-900 hover:text-[#17B169] transition-colors duration-200">{agency.profile.agencyName}</h3>
                                            </a>
                                            <p className="text-sm text-gray-600 italic mt-1">{agency.profile.slogan}</p>
                                        </div>
                                    </div>
                                    {agency.profile && (
                                        <div className="space-y-3">
                                            <p className="flex items-center text-gray-700"><MapPin className="w-5 h-5 mr-2 text-[#17B169]" /> {agency.profile.location}</p>
                                            <p className="flex items-center text-gray-700"><Users className="w-5 h-5 mr-2 text-[#17B169]" /> {agency.profile.numberOfEmployees} employees</p>
                                            <p className="flex items-center text-gray-700"><Calendar className="w-5 h-5 mr-2 text-[#17B169]" /> Founded in {agency.profile.yearFounded}</p>
                                            <p className="flex items-center text-gray-700"><DollarSign className="w-5 h-5 mr-2 text-[#17B169]" /> {agency.profile.budgetRange ? `${agency.profile.budgetRange.min} - ${agency.profile.budgetRange.max}` : "N/A"}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleAgencyDetails(agency._id)}
                                        className="mt-6 w-full bg-[#17B169] text-white py-2 px-3 rounded-lg hover:bg-[#149655] transition-colors duration-300 flex items-center justify-center font-semibold text-sm"
                                    >
                                        {expandedAgencies[agency._id] ? (
                                            <>Hide Details <ChevronUp className="ml-2 w-5 h-5" /></>
                                        ) : (
                                            <>Show Details <ChevronDown className="ml-2 w-5 h-5" /></>
                                        )}
                                    </button>
                                </div>
                                {expandedAgencies[agency._id] && agency.profile && (
                                    <div className="px-6 pb-6 space-y-6 animate-fadeIn">
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Expertise:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.profile.expertise?.map((experty, index) => (
                                                    <span key={index} className="bg-white text-gray-500 border-1 border-gray-500 px-3 py-1 rounded-[2px] text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:border-[#17B169] hover:text-white">{experty}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Services Offered:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.profile.servicesOffered?.map((service, index) => (
                                                    <span key={index} className="bg-white text-gray-500 border-1 border-gray-500 px-3 py-1 rounded-[2px] text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:border-[#17B169] hover:text-white">{service}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Industries:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.profile.industries?.map((industry, index) => (
                                                    <span key={index} className="bg-white text-gray-500 border-1 border-gray-500 px-3 py-1 rounded-[2px] text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:border-[#17B169] hover:text-white">{industry}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Portfolio Highlights:</p>
                                            {agency.profile.portfolio?.length > 0 ? (
                                                <ul className="space-y-4">
                                                    {agency.profile.portfolio.map((item, index) => (
                                                        <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm  transition-all duration-300">
                                                            <p
                                                                onClick={() => togglePortfolioDetails(item.id || index)}
                                                                className="cursor-pointer text-[#17B169] hover:text-[#149655] mb-2 flex items-center"
                                                            >
                                                                <Star className="w-5 h-5 mr-2" />
                                                                {item.title || `Portfolio ${index + 1}`}
                                                            </p>
                                                            {expandedPortfolios[item.id || index] && (
                                                                <div className="mt-3 space-y-2 text-gray-700">
                                                                    <p><span className="font-semibold">Challenge:</span> {item.challenge}</p>
                                                                    <p><span className="font-semibold">Solution:</span> {item.solution}</p>
                                                                    <p><span className="font-semibold">Result:</span> {item.result}</p>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-600 italic">No portfolio available.</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Awards:</p>
                                            {agency.profile.awards?.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {agency.profile.awards.map((award, index) => (
                                                        <li key={index} className="flex items-center bg-yellow-50 p-3 rounded-lg">
                                                            <Award className="w-6 h-6 mr-3 text-yellow-500" />
                                                            <span className="text-gray-700 font-medium">{award.awardName} <span className="text-gray-600">({award.year})</span></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-600 italic">No awards available.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
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