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
  {/* Title */}
  <title>Explore Project Listings | Opportunities for Agencies and Marketers</title>

  {/* Meta Tags */}
  <meta name="description" content="Browse top project listings on Qualtr. Find opportunities tailored for agencies and marketers to grow their expertise and portfolio." />
  <meta name="keywords" content="explore projects, project listings, marketing opportunities, agency projects, Qualtr platform, digital marketing projects" />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="language" content="en" />
  <meta name="rating" content="general" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://www.qualtr.com/open-projects" />

  {/* Favicon */}
  <link rel="icon" href="/Q.ico" />

  {/* Theme Color */}
  <meta name="theme-color" content="#0056b3" />

  {/* Open Graph */}
  <meta property="og:title" content="Explore Opportunities | Top Projects for Agencies & Marketers" />
  <meta property="og:description" content="Browse top project listings on Qualtr. Find opportunities tailored for agencies and marketers to grow their expertise and portfolio." />
  <meta property="og:url" content="https://www.qualtr.com/open-projects" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.qualtr.com/images/explore-projects-og.jpg" />
  <meta property="og:locale" content="en_US" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Explore Opportunities | Top Projects for Agencies & Marketers" />
  <meta name="twitter:description" content="Browse top project listings on Qualtr. Find opportunities tailored for agencies and marketers to grow your expertise." />
  <meta name="twitter:image" content="https://www.qualtr.com/images/explore-projects-twitter.jpg" />

  {/* Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Explore Project Listings",
      "description": "Browse top project listings on Qualtr. Find opportunities tailored for agencies and marketers to grow their expertise and portfolio.",
      "url": "https://www.qualtr.com/open-projects",
      "thumbnailUrl": "https://www.qualtr.com/images/explore-projects-og.jpg",
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
