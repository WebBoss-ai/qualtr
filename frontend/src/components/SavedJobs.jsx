import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Helmet } from 'react-helmet';
import { JOB_API_END_POINT } from '@/utils/constant';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated. Please log in.');
                }
                const response = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                console.log('Saved projects response:', response.data);
                setSavedJobs(response.data);
            } catch (error) {
                console.error('Error fetching saved projects:', error);
                setSavedJobs([]);
            }
        };

        fetchSavedJobs();
    }, []);

    const limitTextLength = (text, limit) => {
        return text?.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = savedJobs ? savedJobs.slice(indexOfFirstJob, indexOfLastJob) : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUnsaveJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${JOB_API_END_POINT}/saved/${jobId}`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        } catch (error) {
            console.error('Error removing saved job:', error);
        }
    };

    if (savedJobs === null) {
        return (

            <div className="p-5 text-center">
                <h1 className="text-2xl font-bold">Loading saved projects...</h1>
            </div>
        );
    }

    if (savedJobs.length === 0) {
        return (
            <div className="p-5 text-center">
                <h1 className="text-2xl font-bold">No saved projects</h1>
                <p className="text-gray-600">You haven't saved any projects yet.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
           <Helmet>
  <title>Saved Projects | Your Favorite Opportunities on Qualtr</title>
  <meta name="description" content="View and manage your saved projects. Explore opportunities that align with your goals." />
  <meta name="keywords" content="saved projects, favorite opportunities, project tracking, bookmarked projects, business opportunities, potential partnerships, marketing projects, Qualtr saved projects" />
</Helmet>

            <div className="flex flex-col gap-6">
                {currentJobs.map((job) => (
                    <div key={job._id} className="p-5 rounded-lg border border-[1px] bg-white border-gray-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500">
                                {daysAgoFunction(job.createdAt) === 0 ? "Today" : `${daysAgoFunction(job.createdAt)} days ago`}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 my-2">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={job?.company?.logo || '/default-logo.png'} alt="Company Logo" />
                            </Avatar>
                            <div>
                                <h1 className="font-medium text-xl">{job?.company?.name || 'Unknown Company'}</h1>
                                <p className="text-sm text-gray-500">India</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <h1 className="font-bold text-xl my-2 text-gray-800">{limitTextLength(job.title, 50)}</h1>
                            <p className="text-sm text-gray-600">{limitTextLength(job.description, 100)}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Badge className="bg-gray-100 text-gray-700 rounded-md px-3 py-1">{job.category}</Badge>
                            <Badge className="bg-gray-100 text-gray-700 rounded-md px-3 py-1">₹{job.salary}</Badge>
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button onClick={() => navigate(`/description/${job._id}`)} variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                Details
                            </Button>
                            <Button onClick={() => handleUnsaveJob(job._id)} variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                                Unsave
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(savedJobs.length / jobsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SavedJobs;
