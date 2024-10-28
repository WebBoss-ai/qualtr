import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LatestJobCards from './LatestJobCards';
import { JOB_API_END_POINT } from '@/utils/constant';

const LatestJobsByCategory = ({ category }) => {
    const [categoryJobs, setCategoryJobs] = useState([]);
    const [showMore, setShowMore] = useState(false); // To manage "See More" button state

    useEffect(() => {
        const fetchCategoryJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/jobs-by-category`, {
                    params: { category },
                    withCredentials: true
                });
                if (res.data.success) {
                    setCategoryJobs(res.data.jobs);
                }
            } catch (error) {
                console.error('Error fetching category jobs:', error);
            }
        };

        if (category) {
            fetchCategoryJobs();
        }
    }, [category]);

    return (
        <div className='my-8'>
            <h2 className='text-3xl font-bold mb-6'>
                More Projects in <span className='text-[#17B169]'>{category}</span>
            </h2>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {
                    categoryJobs.length <= 0 
                        ? <span>No Project Available in this Category</span> 
                        : categoryJobs
                            .slice(0, showMore ? categoryJobs.length : 3) 
                            .map((job) => <LatestJobCards key={job._id} job={job} />)
                }
            </div>

            {categoryJobs.length > 3 && (
                <div className='mt-8 text-center'>
                    <button 
                        onClick={() => setShowMore(!showMore)} 
                        className='px-6 py-3 bg-[#17B169] text-white rounded-lg hover:bg-[#149b58] transition-colors'
                    >
                        {showMore ? 'See Less' : 'See More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default LatestJobsByCategory;
