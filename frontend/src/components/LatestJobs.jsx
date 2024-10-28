import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className='text-4xl font-bold text-center mb-8'>
                Discover the <span className='text-[#F83002]'>Latest & Top </span> Digital Marketing Projects
            </h1>

            {/* Job Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    allJobs.length <= 0 ? (
                        <span className='col-span-full text-center text-gray-500'>No Projects Available</span>
                    ) : (
                        allJobs.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default LatestJobs;
