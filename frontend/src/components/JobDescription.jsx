import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Heart, Flag, MapPin, Clock, DollarSign, BarChart, Briefcase } from 'lucide-react';

import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import Navbar from './shared/Navbar';
import LatestJobsByCategory from './LatestJobsByCategory';
import Footer from './shared/Footer';
import { Helmet } from 'react-helmet';

const JobDescription = () => {
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [showModal, setShowModal] = useState(false);
    const [proposal, setProposal] = useState(null);
    const [whyYou, setWhyYou] = useState(null);
    const [budget, setBudget] = useState(null);

    const [documentUrl, setDocumentUrl] = useState(null);

    const [isLoading, setIsLoading] = useState(false); // State to handle loading


    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('proposal', proposal);
        formData.append('whyYou', whyYou);
        formData.append('budget', budget);

        setIsLoading(true);

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
                setShowModal(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false); // Stop loading after the request
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                const { job, documentUrl } = res.data;

                if (res.data.success) {
                    dispatch(setSingleJob(job));
                    setDocumentUrl(documentUrl);
                    setIsApplied(job.applications.some((application) => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    if (!singleJob) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    console.log(singleJob.presignedUrl)

    return (
        <div className={`${isLoading ? 'blur-sm' : ''}`}>
             <Helmet>
        <title>Project Details | Find Out More About This Opportunity</title>
      </Helmet>
            <Navbar />
            <div className="bg-gray-50 min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
                    {/* Left Content: Job Details (70%) */}
                    <div className="md:flex-grow md:basis-[70%] w-full bg-white rounded-xl overflow-hidden">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-full"
                                            src={singleJob?.company?.logo}
                                            alt={singleJob?.company?.name}
                                        />
                                    </div>
                                    <div className="ml-4 md:ml-6">
                                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{singleJob?.category}</div>
                                        <h1 className="block mt-1 text-lg md:text-xl font-bold text-gray-900">{singleJob?.title}</h1>
                                        <p className="mt-2 text-gray-500">{singleJob?.company?.name} • {singleJob?.company?.location}</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Salary, Timeline, Applications */}
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap -mx-2 mb-6 md:mb-8">
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                                        <DollarSign className="text-[#006241] mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-700 text-sm md:text-base">Budget</h3>
                                            <p className="text-gray-900 text-sm md:text-base">₹{singleJob.salary}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                                        <Clock className="text-[#006241] mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-700 text-sm md:text-base">Timeline</h3>
                                            <p className="text-gray-900 text-sm md:text-base">{singleJob.timeline}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                                        <BarChart className="text-[#006241] mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-700 text-sm md:text-base">Applications</h3>
                                            <p className="text-gray-900 text-sm md:text-base">{singleJob.applications.length} applied</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-lg md:text-xl font-semibold mb-4">Project Description</h2>
                                <p className="text-gray-700 text-sm md:text-base">{singleJob.description}</p>
                            </div>

                            {/* Company Info */}
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-lg md:text-xl font-semibold mb-4">About {singleJob.company.name}</h2>
                                <p className="text-gray-700 text-sm md:text-base">{singleJob.company.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-lg md:text-xl font-semibold mb-4">Requirements</h2>
                                {documentUrl ? (
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-[#17B169] text-white rounded-[8px] px-5 py-2 text-xs md:text-sm hover:bg-[#006241] transition duration-300"
                                    >
                                        View Document
                                    </a>
                                ) : (
                                    <p className="text-gray-500">No requirement document available</p>
                                )}
                            </div>
                            <div>
                                <div className="flex space-x-2 md:space-x-4">
                                    <button className="flex items-center text-gray-500 hover:text-green-900 transition-colors text-sm md:text-base">
                                        <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                                        <span>Save Project</span>
                                    </button>
                                    <button className="flex items-center text-gray-500 hover:text-red-900 transition-colors text-sm md:text-base">
                                        <Flag className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                                        <span>Flag as inappropriate</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Client Details (30%) */}
                    <div className="md:flex-grow md:basis-[30%] w-full bg-gray-100 p-4 md:p-6 rounded-lg space-y-4 md:space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Client Details</h3>
                            <p className="text-[#454955] mb-2">Client Name: <span className="text-[#17B169]">{singleJob.company?.name}</span></p>
                            <p className="text-[#454955] mb-2">Client Location: <span className="text-[#17B169]">{singleJob.company?.location}</span></p>
                            <p className="text-[#454955] mb-2">Client Industry: <span className="text-[#17B169]">{singleJob?.category}</span></p>
                            <p className="text-[#454955]">Applications: <span className="text-[#17B169]">{singleJob.applications.length}</span></p>
                        </div>


                        {/* Apply Now Button */}
                        <div className="mt-4 md:mt-6">
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={isApplied || isLoading}
                            className={`py-3 px-6 rounded-lg text-white font-semibold w-full transition duration-300 text-sm md:text-base ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#17B169] hover:bg-[#006241]'} ${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                        >
                            {isApplied ? 'Already Applied' : isLoading ? 'Submitting...' : 'Apply Now'}
                        </button>
                    </div>
                    </div>
                </div>
                <div className="mx-auto my-4 md:my-6">
                    <LatestJobsByCategory category={singleJob?.category[0]} />
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="relative p-6 max-w-lg w-full bg-white shadow-2xl rounded-lg transform transition-all duration-300 ease-in-out">
                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => setShowModal(false)}
                                disabled={isLoading}
                            >
                                &times;
                            </button>

                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Proposal</h3>

                                {/* Why you? field */}
                                <div className="mb-5">
                                    <label className="block text-left text-gray-700 mb-1" htmlFor="whyYou">
                                        Why you? <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="whyYou"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                        placeholder="Why are you the right fit for this brand?"
                                        value={whyYou}
                                        onChange={(e) => setWhyYou(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Budget field */}
                                <div className="mb-5">
                                    <label className="block text-left text-gray-700 mb-1" htmlFor="budget">
                                        Budget <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="budget"
                                        type="number"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                        placeholder="Enter your proposed budget"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* File upload */}
                                <div className="mb-6">
                                    <label className="block text-left text-gray-700 mb-1">Upload Proposal (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setProposal(e.target.files[0])}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 hover:file:shadow-lg transition-shadow duration-300"
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    onClick={applyJobHandler}
                                    disabled={isLoading}
                                    className={`bg-[#17B169] hover:bg-[#006241] text-white font-semibold py-3 px-6 rounded-lg w-full transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </div>

    );
};

export default JobDescription;
