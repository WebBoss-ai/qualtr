import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUsers, faEye } from '@fortawesome/free-solid-svg-icons';
import { JOB_SEEKER_API_END_POINT } from '@/utils/constant';

const TopJobSeekers = () => {
    const [jobSeekers, setJobSeekers] = useState([]);

    useEffect(() => {
        fetch(`${JOB_SEEKER_API_END_POINT}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setJobSeekers(data.jobSeekers.slice(0, 6)); // Only get the first 6 job seekers
                }
            })
            .catch(error => console.error("Error fetching agencies:", error));
    }, []);

    // Function to get 3 random services offered by the job seeker
    const getRandomServices = (services) => {
        if (services.length <= 3) return services;
        return services.sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    return (
        <div className="bg-gray-100 py-8 font-inter">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Top Agencies</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobSeekers.length > 0 ? (
                        jobSeekers.map(jobSeeker => (
                            <div key={jobSeeker._id} className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={jobSeeker.profile.profilePhoto || 'https://via.placeholder.com/100'} alt="profile" />
                                    </Avatar>
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold">{jobSeeker?.profile?.agencyName}</h2>
                                        <p className="text-xs text-gray-500">{jobSeeker?.profile?.slogan || 'No slogan available'}</p>
                                        <div className="text-xs text-gray-600 mt-1 flex items-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                            <span>{jobSeeker?.profile?.location || 'Unknown'}</span>
                                        </div>

                                        {/* Random 3 services offered */}
                                        <div className="flex gap-2 mt-2">
                                            {getRandomServices(jobSeeker.profile.servicesOffered).map((service, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-white text-gray-800 px-2 py-1 rounded-full border border-gray-300 hover:bg-black hover:text-white transition-all"
                                                >
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* View Complete Profile Icon */}
                                    <Link to={`/agency/${jobSeeker._id}`} className="text-gray-600 hover:text-black transition-all ml-auto">
                                        <FontAwesomeIcon icon={faEye} className="text-lg" title="View Complete Profile" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* Explore More Agencies Button */}
                <div className="text-center mt-6">
                    <Link to="/all-job-seekers" className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition-all">
                        Explore More Agencies
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopJobSeekers;
