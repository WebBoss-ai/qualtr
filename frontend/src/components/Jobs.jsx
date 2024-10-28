import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Helmet } from 'react-helmet';

const Jobs = () => {
    // Call the useGetAllJobs hook to fetch all jobs
    useGetAllJobs();  // No need to dispatch, the hook will handle the fetching

    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    // Pagination calculations
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filterJobs.length / jobsPerPage);

    // Filter jobs based on search query or show all jobs
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const title = job.title ? job.title.toLowerCase() : '';
                const description = job.description ? job.description.toLowerCase() : '';
                const location = job.location ? job.location.toLowerCase() : '';
                const search = searchedQuery.toLowerCase();

                return title.includes(search) || description.includes(search) || location.includes(search);
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
        <title>Explore Project Listings | Opportunities for Agencies and Marketers</title>
      </Helmet>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4 bg-white p-4 rounded-lg border border-gray-300">
                        <FilterCard />
                    </aside>

                    {/* Job Listings */}
                    <section className="flex-1 h-[88vh] overflow-y-auto pb-5">
                        {
                            currentJobs.length <= 0 ? (
                                <div className="flex justify-center items-center h-full text-gray-600">
                                    <span>Project not found</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {
                                        currentJobs.map((job) => (
                                            <motion.div
                                                key={job?._id}
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white rounded-lg border"
                                            >
                                                <Job job={job} limitTitle={25} limitDescription={25} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            )
                        }

                        {/* Pagination */}
                        <div className="flex justify-center mt-8">
                            <ul className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => paginate(i + 1)}
                                            className={`px-4 py-2 rounded-md ${
                                                currentPage === i + 1
                                                    ? 'bg-[#17B169] text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-[#006241] hover:text-white'
                                            } transition duration-300`}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Jobs;
