import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Helmet } from 'react-helmet';
import { JOB_SEEKER_API_END_POINT } from '@/utils/constant';
import { USER_API_END_POINT } from '@/utils/constant';
import { Calendar, Star, Users, MapPin, CookingPot } from 'lucide-react';
import axios from "axios";

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
    const isMobile = window.innerWidth <= 768;
    const [currentPage, setCurrentPage] = useState(1);
    const jobSeekersPerPage = 8;

    const metroCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];
    const servicesList = [
        'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
        'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
        'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
        'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
        'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management'
    ];

    const generateRandomRating = () => (Math.random() * 0.5 + 4.5).toFixed(1);

    const [compareList, setCompareList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalAgencies, setTotalAgencies] = useState(0);

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

    useEffect(() => {
        const fetchCompareList = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${USER_API_END_POINT}/compare`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setCompareList(response.data.compareList.map((agency) => agency._id));
                    setTotalAgencies(response.data.compareList.length);
                }
            } catch (error) {
                console.error("Error fetching compare list:", error);
            }
        };
        fetchCompareList();
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
            filtered = filtered.filter(js => js.profile?.servicesOffered?.includes(service));
        }
        if (city) {
            filtered = filtered.filter(js => js.profile?.location === city);
        }
        if (query) {
            filtered = filtered.filter(js => {
                const agencyName = js.profile?.agencyName?.toLowerCase() || "";
                const slogan = js.profile?.slogan?.toLowerCase() || "";
                return agencyName.includes(query.toLowerCase()) || slogan.includes(query.toLowerCase());
            });
        }

        setFilteredJobSeekers(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };

    const handleAddToCompare = async (agencyId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${USER_API_END_POINT}/compare`,
                { agencyId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setCompareList((prevList) => [...prevList, agencyId]);
                setTotalAgencies((prevCount) => prevCount + 1);
                setModalVisible(true); // Show modal
            }
        } catch (error) {
            console.error("Error adding to compare list:", error);
        }
    };

    // Navigate to compare list page
    const navigateToCompareList = () => {
        navigate("/compare-list");
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
                <meta name="description" content="Discover and browse through our curated list of qualified marketing agencies. Find the perfect partner for your business needs." />
                <meta name="keywords" content="marketing agencies, agency listings, business partnerships, branding partners, advertising agencies, creative agencies, top agencies, business growth partners" />
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
                                currentJobSeekers.map(jobSeeker => (
                                    <div key={jobSeeker._id} className="bg-white rounded-lg overflow-hidden transition-all duration-300 border-b border-gray-400"> {/* Removed shadow */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden">
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
                                                            <h2 className="text-2xl font-bold text-gray-900 hover:text-[#17B169] transition-colors duration-200">{jobSeeker?.profile?.agencyName}</h2>
                                                        </a>
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
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                                                    {jobSeeker?.profile?.location || 'No location'}
                                                </span>
                                                <span className="flex items-center mr-4 mb-2">
                                                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                                    {jobSeeker?.profile?.yearFounded || 'N/A'}
                                                </span>
                                                <span className="flex items-center mr-4 mb-2">
                                                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                                                    {jobSeeker?.profile?.numberOfEmployees || 'N/A'} employees
                                                </span>
                                                <span className="flex items-center mb-2">
                                                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                                    {jobSeeker?.profile?.rating || 'No rating'}
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
                                            <div className='flex'>
                                                <a href={`/agency/${jobSeeker._id}`} className="text-[#17B169] hover:underline">
                                                    <div className="flex items-center space-x-2 font-medium">
                                                        <span>View Complete Profile</span>
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </a>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        !compareList.includes(jobSeeker._id) && handleAddToCompare(jobSeeker._id);
                                                    }}
                                                    className={`px-4 ${compareList.includes(jobSeeker._id) ? "text-gray-500" : "text-[#17B169]"} hover:underline cursor-pointer`}
                                                >
                                                    <div className="flex items-center space-x-2 font-medium">
                                                        <span>{compareList.includes(jobSeeker._id) ? "Already Added" : "Add to Compare"}</span>
                                                        {!compareList.includes(jobSeeker._id) && (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </a>

                                            </div>
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

                        {modalVisible && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 1000,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        width: "400px",
                                        textAlign: "center",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                >
                                    <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                                        Agency Added to Compare List
                                    </h2>
                                    <p style={{ fontSize: "14px", marginBottom: "20px" }}>
                                        You've successfully added {totalAgencies} agency{totalAgencies > 1 ? "ies" : ""} to the
                                        compare list.
                                    </p>
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            backgroundColor: "#17B169",
                                            color: "#fff",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Close
                                    </button>
                                    <br />
                                    <a
                                        href="/compare-list"
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            backgroundColor: "#007BFF",
                                            color: "#fff",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        View Complete Compare List
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: isMobile ? "row" : "row",
                                justifyContent: isMobile ? "space-between" : "center",
                                alignItems: "center",
                                marginTop: "16px",
                            }}
                        >
                            {/* Previous Button */}
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    backgroundColor: currentPage === 1 ? "#f3f4f6" : "#ffffff",
                                    color: currentPage === 1 ? "#9ca3af" : "#4b5563",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    margin: isMobile ? "0" : "0 8px",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    style={{ width: "20px", height: "20px", marginRight: "8px" }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                                Prev
                            </button>

                            {isMobile ? (
                                // Mobile Layout with Page Indicator
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#374151",
                                    }}
                                >
                                    Page <span style={{ fontWeight: "bold" }}>{currentPage}</span> of{" "}
                                    <span style={{ fontWeight: "bold" }}>{totalPages}</span>
                                </span>
                            ) : (
                                // Desktop Layout with Pagination Links
                                <nav className="inline-flex overflow-x-auto whitespace-nowrap">
                                    {[...Array(totalPages).keys()]
                                        .filter((pageNumber) => {
                                            const page = pageNumber + 1;
                                            return (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 2 && page <= currentPage + 2)
                                            );
                                        })
                                        .map((pageNumber, index, filteredPages) => {
                                            const page = pageNumber + 1;
                                            const isEllipsisBefore =
                                                index > 0 && filteredPages[index - 1] + 1 !== pageNumber;
                                            const isEllipsisAfter =
                                                index < filteredPages.length - 1 &&
                                                filteredPages[index + 1] - 1 !== pageNumber;

                                            return (
                                                <React.Fragment key={page}>
                                                    {isEllipsisBefore && <span className="mx-1 px-2 py-2">...</span>}
                                                    <button
                                                        onClick={() => paginate(page)}
                                                        className={`mx-1 px-3 py-2 border rounded ${currentPage === page
                                                            ? "bg-[#17B169] text-white"
                                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                        style={{
                                                            transition: "transform 0.3s, box-shadow 0.3s",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (currentPage !== page)
                                                                e.target.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.boxShadow = "none";
                                                        }}
                                                    >
                                                        {page}
                                                    </button>
                                                    {isEllipsisAfter && <span className="mx-1 px-2 py-2">...</span>}
                                                </React.Fragment>
                                            );
                                        })}
                                </nav>

                            )}
                            {/* Next Button */}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#ffffff",
                                    color: currentPage === totalPages ? "#9ca3af" : "#4b5563",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    margin: isMobile ? "0" : "0 8px",
                                }}
                            >
                                Next
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    style={{ width: "20px", height: "20px", marginLeft: "8px" }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 4.5L15.75 12l-7.5 7.5"
                                    />
                                </svg>
                            </button>
                        </div>



                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default JobSeekersList;
