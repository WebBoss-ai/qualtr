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
        <title>Agency Profile | Learn More About Our Partners</title>
      </Helmet>
            <Navbar />
            <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile?.profile?.profilePhoto || 'https://via.placeholder.com/150'} alt="profile" />
                        </Avatar>
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
            <Footer />
        </div>
    );
};

export default JobSeekerProfile;
