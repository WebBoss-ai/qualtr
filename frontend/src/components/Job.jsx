import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react'; // BookmarkCheck for saved icon
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { JOB_API_END_POINT } from '@/utils/constant';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false); // State to track if the job is saved

  // Check if the job is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`${JOB_API_END_POINT}/is-saved/${job._id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, // Ensure token is sent
          withCredentials: true,
        });
  
        if (response.status === 200 && response.data.isSaved) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking if project is saved:', error);
      }
    };
  
    checkIfSaved();
  }, [job._id]);
  
  // Save job for later
  const saveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await axios.post(
        `${JOB_API_END_POINT}/save/${jobId}`,
        {},
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Include the token in the headers
          },
          withCredentials: true,
        }
      );
      

      if (response.status === 200) {
        setIsSaved(true); // Mark the job as saved
        alert('Project saved successfully');
      } else {
        alert('Failed to save Project');
      }
    } catch (error) {
      console.error('Failed to save Project:', error);
      alert(error.response?.data?.message || 'Error saving Project');
    }
  };

  // Limit the title and description length
  const limitTextLength = (text, limit) => {
    return text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className='p-5 rounded-md bg-white border border-gray-200'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgoFunction(job?.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant='outline'
          className='rounded-full'
          size='icon'
          disabled={isSaved} // Disable if job is already saved
          onClick={() => saveJob(job._id)}
        >
          {isSaved ? <BookmarkCheck /> : <Bookmark />} {/* Change icon based on save status */}
        </Button>
      </div>

      <div className='flex items-center gap-2 my-2'>
        <Button className='p-6' variant='outline' size='icon'>
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>

      <div>
        <h1 className='font-bold text-2xl my-2 text-[#111d13]'>{limitTextLength(job?.title, 25)}</h1>
        <p className='text-sm text-gray-600'>{limitTextLength(job?.description, 50)}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge className='text-gray-600 font-medium border border-gray-300 bg-white hover:bg-black hover:text-white transition-colors duration-200 rounded-md px-3 py-1' variant='ghost'>
          {job?.category}
        </Badge>
        <Badge className='text-gray-600 font-medium border border-gray-300 bg-white hover:bg-black hover:text-white transition-colors duration-200 rounded-md px-3 py-1' variant='ghost'>
          {job?.applications?.length} Bids
        </Badge>
        <Badge className='text-gray-600 font-medium border border-gray-300 bg-white hover:bg-black hover:text-white transition-colors duration-200 rounded-md px-3 py-1' variant='ghost'>
          ₹{job?.salary}
        </Badge>
      </div>

      <div className='flex items-center gap-4 mt-4'>
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant='outline' className='text-[#006241]'>
          Details
        </Button>
        <Button
          className='bg-[#17B169] text-white'
          onClick={() => saveJob(job._id)}
          disabled={isSaved} // Disable if job is already saved
        >
          {isSaved ? 'Already Saved' : 'Save For Later'} {/* Change button text based on save status */}
        </Button>
      </div>
    </div>
  );
};

export default Job;
