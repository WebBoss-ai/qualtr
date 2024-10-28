import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaCalendarAlt, FaMoneyBillWave, FaBriefcase, FaUserTie, FaMapMarkerAlt } from 'react-icons/fa';

const LatestJobCards = ({ job }) => {
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleCardClick = () => {
        setLoading(true); // Start loading
        setTimeout(() => {
            setLoading(false); // Stop loading after 2 seconds
            navigate(`/description/${job._id}`); // Navigate to the new page
            window.location.reload(); // Refresh the page
        }, 800); // 2 second delay
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div 
            onClick={handleCardClick} // Call handleCardClick on card click
            className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer border border-gray-100 relative'
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="loader border-t-4 border-green-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
                </div>
            )}

            <div className={`flex items-center justify-between mb-4 ${loading ? 'opacity-50' : ''}`}>
                <div className="flex items-center space-x-4">
                    <img 
                        src={job?.company?.logo || '/default-logo.png'} 
                        alt={`${job?.company?.name} logo`} 
                        className='w-12 h-12 object-cover rounded-full ring-2 ring-gray-100' 
                    />
                    <div>
                        <h2 className='font-semibold text-gray-800'>{job?.company?.name}</h2>
                        <p className='text-sm text-gray-500 flex items-center'>
                            {job?.company?.location || 'India'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">{formatDate(job?.createdAt)}</p>
                </div>
            </div>
            
            <h1 className='text-xl font-bold text-gray-900 mb-2'>
                {job?.title?.slice(0, 20)}{job?.title?.length > 20 && '...'}
            </h1>
            <p className='text-gray-600 mb-4 line-clamp-2'>
                {job?.description?.slice(0, 20)}{job?.description?.length > 20 && '...'}
            </p>
            
            <div className='flex flex-wrap items-center gap-3 text-sm'>
                <span className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-green-100 transition-colors'>
                    <FaUserTie className="mr-1" />
                    {job?.applications?.length} Bids
                </span>
                <span className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-green-100 transition-colors'>
                    <FaBriefcase className="mr-1" />
                    {job?.category}
                </span>
                <span className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-green-100 transition-colors'>
                    <FaMoneyBillWave className="mr-1" />
                    ${job?.salary || 'Not specified'}
                </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button 
                    onClick={(e) => { e.stopPropagation(); handleCardClick(); }} // Stop event propagation
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-300"
                >
                    View Details
                </button>
                <div className="flex space-x-2">
                    {['Qualtr'].map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LatestJobCards;
