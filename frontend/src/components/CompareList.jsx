import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";

const CompareList = () => {
    const [compareList, setCompareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAgencies, setExpandedAgencies] = useState({});
    const [expandedPortfolios, setExpandedPortfolios] = useState({});

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
                <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Compare Agencies</h1>
                {compareList.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No agencies added to the compare list yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {compareList.map((agency) => (
                            <div key={agency._id} className="bg-white rounded-xl overflow-hidden transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <img
                                            src={agency.profile.profilePhoto || "/placeholder.svg?height=80&width=80"}
                                            alt={agency.profile.agencyName}
                                            className="w-20 h-20 rounded-full object-cover mr-4 border-1 border-[#17B169]"
                                        />
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{agency.profile.agencyName}</h3>
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
                                                    <span key={index} className="bg-white text-gray-500 border-2 border-gray-500 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:text-white">{experty}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Services Offered:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.profile.servicesOffered?.map((service, index) => (
                                                    <span key={index} className="bg-white text-gray-500 border-2 border--gray-500 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:text-white">{service}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 mb-3 text-lg">Industries:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {agency.profile.industries?.map((industry, index) => (
                                                    <span key={index} className="bg-white text-gray-500 border-2 border-gray-500 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-300 hover:bg-[#17B169] hover:text-white">{industry}</span>
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