import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2, ChevronDown, ChevronUp, Award, Briefcase, Users, MapPin, Calendar, DollarSign } from 'lucide-react';

const CompareList = () => {
    const [compareList, setCompareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAgency, setExpandedAgency] = useState(null);

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
        setExpandedAgency(expandedAgency === agencyId ? null : agencyId);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-[#B5D3D3]" />
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Compare Agencies</h1>
            {compareList.length === 0 ? (
                <p className="text-center text-gray-600">No agencies added to the compare list yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {compareList.map((agency) => (
                        <div key={agency._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src={agency.profile.profilePhoto || "/placeholder.svg?height=50&width=50"} 
                                        alt={agency.fullname} 
                                        className="w-16 h-16 rounded-full object-cover mr-4" 
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{agency.fullname}</h3>
                                        <p className="text-sm text-gray-600">{agency.email}</p>
                                    </div>
                                </div>
                                {agency.profile && (
                                    <div className="space-y-2">
                                        <p className="flex items-center text-gray-700"><Briefcase className="w-4 h-4 mr-2 text-[#B5D3D3]" /> {agency.profile.agencyName}</p>
                                        <p className="flex items-center text-gray-700"><MapPin className="w-4 h-4 mr-2 text-[#B5D3D3]" /> {agency.profile.location}</p>
                                        <p className="flex items-center text-gray-700"><Users className="w-4 h-4 mr-2 text-[#B5D3D3]" /> {agency.profile.numberOfEmployees} employees</p>
                                        <p className="flex items-center text-gray-700"><Calendar className="w-4 h-4 mr-2 text-[#B5D3D3]" /> Founded in {agency.profile.yearFounded}</p>
                                        <p className="flex items-center text-gray-700"><DollarSign className="w-4 h-4 mr-2 text-[#B5D3D3]" /> {agency.profile.budgetRange ? `${agency.profile.budgetRange.min} - ${agency.profile.budgetRange.max}` : "N/A"}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => toggleAgencyDetails(agency._id)}
                                    className="mt-4 w-full bg-[#B5D3D3] text-white py-2 px-4 rounded-md hover:bg-[#9DBDBD] transition-colors duration-300 flex items-center justify-center"
                                >
                                    {expandedAgency === agency._id ? (
                                        <>Hide Details <ChevronUp className="ml-2 w-4 h-4" /></>
                                    ) : (
                                        <>Show Details <ChevronDown className="ml-2 w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                            {expandedAgency === agency._id && agency.profile && (
                                <div className="px-6 pb-6 space-y-4 animate-fadeIn">
                                    <p className="text-gray-700"><span className="font-semibold">Slogan:</span> {agency.profile.slogan}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Bio:</span> {agency.profile.bio}</p>
                                    <div>
                                        <p className="font-semibold text-gray-800">Skills:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {agency.profile.skills?.map((skill, index) => (
                                                <span key={index} className="bg-[#B5D3D3] text-white px-2 py-1 rounded-full text-sm">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Services Offered:</p>
                                        <ul className="list-disc list-inside mt-2 text-gray-700">
                                            {agency.profile.servicesOffered?.map((service, index) => (
                                                <li key={index}>{service}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Industries:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {agency.profile.industries?.map((industry, index) => (
                                                <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{industry}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Portfolio Highlights:</p>
                                        {agency.profile.portfolio?.length > 0 ? (
                                            <ul className="mt-2 space-y-2">
                                                {agency.profile.portfolio.slice(0, 2).map((item, index) => (
                                                    <li key={index} className="bg-gray-100 p-3 rounded-md">
                                                        <p className="font-semibold text-gray-800">{item.title}</p>
                                                        <p className="text-sm text-gray-600">{item.result}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 italic">No portfolio available.</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Awards:</p>
                                        {agency.profile.awards?.length > 0 ? (
                                            <ul className="mt-2 space-y-2">
                                                {agency.profile.awards.map((award, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <Award className="w-4 h-4 mr-2 text-[#B5D3D3]" />
                                                        <span className="text-gray-700">{award.awardName} ({award.year})</span>
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
    );
};

export default CompareList;