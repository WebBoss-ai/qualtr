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
