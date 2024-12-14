import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompareAgencies = () => {
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
            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-8 bg-gray-50">
                    {compareList.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">No agencies added to the compare list yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {compareList.map((agency) => (
                                <div key={agency._id} className="bg-white rounded-xl overflow-hidden border border-gray-700 border-1 transition-all duration-300">
                                    <div className="p-8">
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="h-16 w-16 rounded-full flex items-center border-2 border-emerald-200 shadow-md justify-center overflow-hidden">
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
                                                    <h4 className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-200">
                                                        {agency.profile.agencyName}
                                                    </h4>
                                                </a>
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
                                                    <span>{agency.profile.location}</span>
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
            </div>
        </div>

    );
};

export default CompareAgencies;