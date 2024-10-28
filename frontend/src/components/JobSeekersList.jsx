import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Helmet } from 'react-helmet';
import { JOB_SEEKER_API_END_POINT } from '@/utils/constant';

const JobSeekersList = () => {
    const [jobSeekers, setJobSeekers] = useState([]);
    const [filteredJobSeekers, setFilteredJobSeekers] = useState([]);
    const [servicesFilter, setServicesFilter] = useState("");
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');
    const [cityFilter, setCityFilter] = useState("");
    const [isServicesExpanded, setIsServicesExpanded] = useState(true);
    const [isCitiesExpanded, setIsCitiesExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const jobSeekersPerPage = 6;

    const metroCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];
    const servicesList = [
        'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
        'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
        'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
        'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
        'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management'
    ];

    const generateRandomRating = () => (Math.random() * 0.5 + 4).toFixed(1);

    useEffect(() => {
        fetch(`${JOB_SEEKER_API_END_POINT}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const updatedJobSeekers = data.jobSeekers.map(jobSeeker => ({
                        ...jobSeeker,
                        profile: {
                            ...jobSeeker.profile,
                            rating: generateRandomRating()
                        }
                    }));
                    setJobSeekers(updatedJobSeekers);
                    setFilteredJobSeekers(updatedJobSeekers);
                }
            })
            .catch(error => console.error("Error fetching agencies:", error));
    }, []);

    const handleServiceFilterChange = (service) => {
        setServicesFilter(service);
        filterJobSeekers(service, cityFilter);
    };

    const handleCityFilterChange = (city) => {
        setCityFilter(city);
        filterJobSeekers(servicesFilter, city);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        filterJobSeekers(servicesFilter, cityFilter, event.target.value);
    };
    

    const filterJobSeekers = (service, city, query = "") => {
        let filtered = jobSeekers;
    
        if (service) {
            filtered = filtered.filter(js => js.profile.servicesOffered.includes(service));
        }
        if (city) {
            filtered = filtered.filter(js => js.profile.location === city);
        }
        if (query) {
            filtered = filtered.filter(js => 
                js.profile.agencyName.toLowerCase().includes(query.toLowerCase()) ||
                js.profile.slogan.toLowerCase().includes(query.toLowerCase())
            );
        }
        setFilteredJobSeekers(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };
    

    // Pagination logic
    const indexOfLastJobSeeker = currentPage * jobSeekersPerPage;
    const indexOfFirstJobSeeker = indexOfLastJobSeeker - jobSeekersPerPage;
    const currentJobSeekers = filteredJobSeekers.slice(indexOfFirstJobSeeker, indexOfLastJobSeeker);

    const totalPages = Math.ceil(filteredJobSeekers.length / jobSeekersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleServicesDropdown = () => setIsServicesExpanded(!isServicesExpanded);
    const toggleCitiesDropdown = () => setIsCitiesExpanded(!isCitiesExpanded);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Helmet>
        <title>Agency Listings | Browse Qualified Marketing Agencies</title>
      </Helmet>
            <Navbar />
            <div className="max-w-9xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:gap-12">
                    <aside className="w-full lg:w-1/4 mb-8 lg:mb-0">
                        <div className="bg-white rounded-lg p-6 sticky top-6">
                            {/* Filter by Service */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 cursor-pointer" onClick={toggleServicesDropdown}>
                                    Filter by Service {isServicesExpanded ? '▼' : '►'}
                                </h2>
                                {isServicesExpanded && (
                                    <ul className="space-y-3">
                                        {servicesList.map((service) => (
                                            <li key={service}>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="serviceFilter"
                                                        value={service}
                                                        className="form-radio h-5 w-5 text-[#17B169]"
                                                        checked={servicesFilter === service}
                                                        onChange={() => handleServiceFilterChange(service)}
                                                    />
                                                    <span className="ml-3 text-xs text-gray-700 hover:text-gray-900 transition-colors">{service}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Filter by City */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 cursor-pointer" onClick={toggleCitiesDropdown}>
                                    Filter by City {isCitiesExpanded ? '▼' : '►'}
                                </h2>
                                {isCitiesExpanded && (
                                    <ul className="space-y-3">
                                        {metroCities.map((city) => (
                                            <li key={city}>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="cityFilter"
                                                        value={city}
                                                        className="form-radio h-5 w-5 text-[#17B169]"
                                                        checked={cityFilter === city}
                                                        onChange={() => handleCityFilterChange(city)}
                                                    />
                                                    <span className="ml-3 text-xs text-gray-700 hover:text-gray-900 transition-colors">{city}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                className="mt-6 text-[#17B169] hover:text-[#139e53] font-medium transition-colors"
                                onClick={() => {
                                    setServicesFilter("");
                                    setCityFilter("");
                                    setFilteredJobSeekers(jobSeekers);
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </aside>

                    <main className="w-full lg:w-3/4">
                    <div className="grid gap-8">
                    <div className="">
                                <input 
                                    type="text" 
                                    placeholder="Search for digital marketing agencies..." 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full p-4 border border-gray-300 rounded-md"
                                />
                            </div>
                            {filteredJobSeekers.length > 0 ? (
                                filteredJobSeekers.map(jobSeeker => (
                                    <div key={jobSeeker._id} className="bg-white rounded-lg overflow-hidden transition-all duration-300 border-b border-gray-400"> {/* Removed shadow */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={jobSeeker.profile.profilePhoto || 'https://via.placeholder.com/100'}
                                                        alt="profile"
                                                        className="h-16 w-16 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900">{jobSeeker?.profile?.agencyName}</h2>
                                                        <p className="text-sm text-gray-500">{jobSeeker?.profile?.slogan || 'No slogan available'}</p>
                                                    </div>
                                                </div>
                                                {jobSeeker?.profile?.agencyName && (
                                                    <span className="bg-green-100 text-green-800 font-semibold text-xs py-1 px-3 rounded-full flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                                                <span className="flex items-center mr-4 mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                                    </svg>
                                                    ${jobSeeker?.profile?.rate || 'N/A'}/hr
                                                </span>
                                                <span className="flex items-center mr-4 mb-2">
                                                    <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                    </svg>
                                                    {jobSeeker?.profile?.rating || 'No rating'}
                                                </span>
                                                <span className="flex items-center mr-4 mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    {jobSeeker?.profile?.numberOfEmployees || 'N/A'} employees
                                                </span>
                                                <span className="flex items-center mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9.243 5.757a4 4 0 115.657 5.657L10 16.314l-4.9-4.9a4 4 0 015.657-5.657z" clipRule="evenodd" />
                                                    </svg>
                                                    {jobSeeker?.profile?.location || 'No location'}
                                                </span>
                                            </div>

                                            {/* Display 3 random services */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {jobSeeker?.profile?.servicesOffered?.slice(0, 5).map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-white text-black border border-gray-400 hover:bg-black hover:text-white text-xs font-medium px-2 py-1 rounded"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}

                                                {jobSeeker?.profile?.servicesOffered?.length > 5 && (
                                                    <span className="bg-white text-black border border-gray-400 hover:bg-black hover:text-white text-xs font-medium px-2 py-1 rounded">
                                                        +{jobSeeker?.profile?.servicesOffered?.length - 5} more
                                                    </span>
                                                )}
                                            </div>


                                            <Link to={`/agency/${jobSeeker._id}`} className="text-[#17B169] hover:underline">
                                                <div className="flex items-center space-x-2 font-medium">
                                                    <span>View Complete Profile</span>
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No agencies found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by searching for agencies or try a different filter.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-8">
                            <nav className="inline-flex">
                                {[...Array(totalPages).keys()].map(pageNumber => (
                                    <button
                                        key={pageNumber + 1}
                                        onClick={() => paginate(pageNumber + 1)}
                                        className={`mx-1 px-3 py-2 border rounded ${currentPage === pageNumber + 1 ? 'bg-[#17B169] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </main>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default JobSeekersList;
