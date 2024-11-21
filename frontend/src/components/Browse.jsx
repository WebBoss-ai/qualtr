import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Helmet } from 'react-helmet';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div>
             <Helmet>
  {/* Title */}
  <title>Discover Projects & Agencies | Qualtr - Empower Your Brand</title>

  {/* Meta Tags */}
  <meta name="description" content="Explore projects and connect with top-rated marketing agencies on Qualtr. Collaborate with experts to grow your brand and achieve your goals." />
  <meta name="keywords" content="browse projects, find agencies, marketing projects, agency listings, Qualtr opportunities" />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="language" content="en" />
  <meta name="rating" content="general" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://www.qualtr.com/browse" />

  {/* Favicon */}
  <link rel="icon" href="/Q.ico" />

  {/* Theme Color */}
  <meta name="theme-color" content="#17B169" />

  {/* Open Graph */}
  <meta property="og:title" content="Discover Projects & Agencies | Qualtr - Empower Your Brand" />
  <meta property="og:description" content="Connect with marketing agencies and explore top projects on Qualtr. Find the perfect opportunity for your brand's growth." />
  <meta property="og:url" content="https://www.qualtr.com/browse" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.qualtr.com/images/browse-og.jpg" />
  <meta property="og:locale" content="en_US" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Discover Projects & Agencies | Qualtr - Empower Your Brand" />
  <meta name="twitter:description" content="Explore projects and connect with marketing agencies on Qualtr. Grow your brand today!" />
  <meta name="twitter:image" content="https://www.qualtr.com/images/browse-twitter.jpg" />

  {/* Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Browse Projects and Agencies",
      "description": "Explore projects and connect with top-rated marketing agencies on Qualtr.",
      "url": "https://www.qualtr.com/browse",
      "thumbnailUrl": "https://www.qualtr.com/images/browse-og.jpg",
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
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse