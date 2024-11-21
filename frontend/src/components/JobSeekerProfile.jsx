import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Mail, Contact, Award, MapPin, Globe, CheckCircle, FileText, BarChart2, Building2 } from 'lucide-react';
import { Badge } from './ui/badge';
import Modal from './ui/Modal';
import Footer from './shared/Footer';
import MessageModal from './MessageModal';
import { Helmet } from 'react-helmet';
import { JOB_SEEKER_API_END_POINT } from '@/utils/constant';
import { Calendar, Star, Shield, Clock } from 'lucide-react'
import img1 from '../images/img_cta_dm.png'

const JobSeekerProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [isOverviewExpanded, setIsOverviewExpanded] = useState(false); // State for overview expand
    const [selectedPortfolio, setSelectedPortfolio] = useState(null); // State for selected portfolio
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open
    const [mailIconDisabled, setMailIconDisabled] = useState(false);




    const handleMailClick = () => {
        if (mailIconDisabled) {
            alert("Your message has already been sent. Qualtr will reach out to you soon.");
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        fetch(`${JOB_SEEKER_API_END_POINT}/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setProfile(data.jobSeeker);
                }
            });
    }, [id]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    const openModal = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setIsModalOpen(true);
    };

    // Function to handle modal close
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPortfolio(null);
    };

    return (
        <div>
            <Helmet>
                {/* Title */}
                <title>Agency Profile | Partner with the Best on Qualtr</title>

                {/* Meta Tags */}
                <meta name="description" content="Learn more about agencies on Qualtr. Explore their expertise, past projects, and client reviews to find the perfect partner for your brand's growth." />
                <meta name="keywords" content="agency profile, digital marketing agencies, find agencies, partner with agencies, agency reviews, Qualtr platform" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="rating" content="general" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://www.qualtr.com/agency/:id" />

                {/* Favicon */}
                <link rel="icon" href="/Q.ico" />

                {/* Theme Color */}
                <meta name="theme-color" content="#17B169" />

                {/* Open Graph */}
                <meta property="og:title" content="Agency Profile | Partner with the Best on Qualtr" />
                <meta property="og:description" content="Explore agency profiles on Qualtr. Discover their expertise, past projects, and client reviews to find the ideal partner for your brand's success." />
                <meta property="og:url" content="https://www.qualtr.com/agency/:id" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.qualtr.com/images/agency/:id-og.jpg" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Agency Profile | Partner with the Best on Qualtr" />
                <meta name="twitter:description" content="Learn more about agencies on Qualtr. Find the perfect partner for your brand's growth through detailed profiles and client reviews." />
                <meta name="twitter:image" content="https://www.qualtr.com/images/agency/:id-twitter.jpg" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Agency Profile",
                        "description": "Learn more about agencies on Qualtr. Explore their expertise, past projects, and client reviews to find the perfect partner for your brand's growth.",
                        "url": "https://www.qualtr.com/agency/:id",
                        "thumbnailUrl": "https://www.qualtr.com/images/agency/:id-og.jpg",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Qualtr",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.qualtr.com/images/logo.png"
                            }
                        }
                    })}
                </script>
            </Helmet>

            <Navbar />
            <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        
                        <div className="h-24 w-24 rounded-full flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={profile.profile.profilePhoto || "https://via.placeholder.com/40"}
                                                    alt={`${profile?.profile?.agencyName || "Agency"} logo`}
                                                    className="h-full w-full object-contain"
                                                />
                                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-800">{profile?.profile?.agencyName}</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" /> {/* Added Location Icon */}
                                {profile?.profile?.location || "Location not provided"}
                            </p>
                        </div>
                    </div>
                    <Mail
                        className={`w-8 h-8 cursor-pointer ${mailIconDisabled ? 'text-gray-400' : 'text-green-700'}`}
                        onClick={handleMailClick}
                    />
                    {isModalOpen && (
                        <MessageModal
                            jobSeekerId={profile?.profile?._id}
                            onClose={() => setIsModalOpen(false)}
                            setMailIconDisabled={setMailIconDisabled}
                        />
                    )}                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Overview and Bio */}
                    {/* Overview and Bio */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
                        <p className="text-sm text-gray-600">
                            {isOverviewExpanded
                                ? profile?.profile?.overview
                                : `${profile?.profile?.overview?.slice(0, 200)}...`}
                        </p>
                        {profile?.profile?.overview?.length > 200 && (
                            <button
                                className="text-green-700 text-sm"
                                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                            >
                                {isOverviewExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        )}
                    </div>
                    {/* <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">About Us</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{profile?.profile?.bio || "No bio available."}</p>
                    </div> */}

                    {/* Contact Information */}
                    {/* <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" /> {profile?.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Contact className="w-4 h-4 text-gray-500" /> {profile?.phoneNumber}
                            </div>
                        </div>
                    </div> */}

                    {/* Company Details */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Company Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-500" /> Number of Employees: {profile?.profile?.numberOfEmployees || 'Not specified'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-500" /> Year Founded: {profile?.profile?.yearFounded || 'Not specified'}
                            </div>
                        </div>
                    </div>

                    {/* Budget Range */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Budget Range</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BarChart2 className="w-4 h-4 text-gray-500" />
                            {profile?.profile?.budgetRange?.min
                                ? `${profile?.profile?.budgetRange.min} - ${profile?.profile?.budgetRange.max}`
                                : 'Not specified'}
                        </div>
                    </div>

                    {/* expertise & Expertise */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Expertise</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile?.profile?.expertise?.length ? (
                                profile?.profile?.expertise.slice(-5).map((expertise, index) => (
                                    <Badge key={index} className="border border-gray-400 font-light bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200">
                                        {expertise}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No expertise listed.</span>
                            )}
                        </div>
                    </div>


                    {/* Services Offered */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Services Offered</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile?.profile?.servicesOffered?.length ? (
                                profile?.profile?.servicesOffered.map((service, index) => (
                                    <Badge
                                        key={index}
                                        className="border border-gray-400 bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200 font-light"
                                    >
                                        {service}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No services listed.</span>
                            )}
                        </div>
                    </div>

                    {/* Industries */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Industries Served</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile?.profile?.industries?.length ? (
                                profile?.profile?.industries.map((industry, index) => (
                                    <Badge key={index} className="border font-light border-gray-400 bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200">{industry}</Badge>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No industries listed.</span>
                            )}
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                            {profile?.profile?.portfolio?.length ? (
                                profile?.profile?.portfolio.map((project, index) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-md shadow">
                                        <h4 className="text-sm font-semibold">{project.title.slice(0, 50)}...</h4>
                                        <button
                                            className="text-green-700 text-sm mt-2"
                                            onClick={() => openModal(project)}
                                        >
                                            Read Now
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No portfolio available.</span>
                            )}
                        </div>
                    </div>

                    {/* Past Clients */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Past Clients</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile?.profile?.pastClients?.length ? (
                                profile?.profile?.pastClients.map((client, index) => (
                                    <Badge key={index} className="border font-light border-gray-400 bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200">{client}</Badge>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No clients listed.</span>
                            )}
                        </div>
                    </div>

                    {selectedPortfolio && (
                        <div
                            className={`fixed inset-0 z-50 overflow-y-auto ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center`}
                            aria-labelledby="modal-title"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                {selectedPortfolio.title}
                                            </h3>
                                            <div className="mt-2">
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-500">Challenge</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedPortfolio.challenge}</p>
                                                </div>
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-500">Solution</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedPortfolio.solution}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Result</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedPortfolio.result}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Awards */}
                    <div className="col-span-2 bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Awards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                            {profile?.profile?.awards?.length ? (
                                profile?.profile?.awards.map((award, index) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-md shadow">
                                        <h4 className="text-sm font-semibold"><Award className="w-4 h-4 inline-block mr-2" /> {award.title}</h4>
                                        <p className="text-xs text-gray-600">{award.date}</p>
                                        <p className="text-xs text-gray-600">{award.description}</p>
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No awards listed.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-10">
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                                    Get matched with{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10 text-[#17B169]">{profile?.profile?.agencyName}</span>
                                        <span className="absolute inset-x-0 -bottom-2 h-4 bg-coral-100 rounded-full -rotate-1"
                                            style={{ backgroundColor: 'rgba(23, 177, 105, 0.2)' }} />
                                    </span>
                                    <br />

                                </h4>
                                <p className="text-lg text-gray-600 max-w-2xl">
                                    Schedule a meeting with <span className='text-[#8C4A17]'>{profile?.profile?.agencyName}</span> at your convenience. On Qualtr, it takes just 11 seconds to book—faster than ever!
                                </p>
                            </div>

                            {/* Trust Signals */}
                            <div className="grid sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-gray-600">Verified Agency</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-400" />
                                    <span className="text-sm text-gray-600">4.9/5 Success</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">24/7 Support</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {/* Add your scheduling logic */ }}
                                className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all"
                                style={{ backgroundColor: '#17B169', boxShadow: '0 4px 14px rgba(23, 177, 105, 0.3)' }}
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Schedule a Meeting
                            </button>
                        </div>

                        {/* Right Illustration */}
                        <div className="relative lg:h-full flex items-center justify-center">
                            <div className="w-full max-w-sm">
                                <img
                                    src={img1}
                                    alt="Descriptive Alt Text"
                                    className="w-full h-auto"
                                    style={{ filter: 'drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.1))' }}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Background Pattern */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(23, 177, 105, 0.1) 0%, transparent 50%)',
                            backgroundSize: '100% 100%'
                        }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobSeekerProfile;
