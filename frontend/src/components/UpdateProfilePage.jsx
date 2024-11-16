import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { Helmet } from 'react-helmet';

// Expanded list of digital marketing services and expertise options
const digitalMarketingOptions = [
  'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
  'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
  'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
  'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
  'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management',
];

const UpdateProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(',') || "",
    agencyName: user?.profile?.agencyName || "",
    slogan: user?.profile?.slogan || "",
    location: user?.profile?.location || "",
    overview: user?.profile?.overview || "",
    numberOfEmployees: user?.profile?.numberOfEmployees || "",
    yearFounded: user?.profile?.yearFounded || "",
    servicesOffered: user?.profile?.servicesOffered || [],
    expertise: user?.profile?.expertise || [],
    industries: user?.profile?.industries?.join(',') || "",
    pastClients: user?.profile?.pastClients?.join(',') || "",
    awards: user?.profile?.awards || []
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const sections = [
    ['fullname', 'email', 'phoneNumber', 'bio', 'skills'],
    ['agencyName', 'slogan', 'location', 'overview', 'numberOfEmployees'],
    ['yearFounded', 'industries', 'pastClients', 'awards'],
    ['servicesOffered'], ['expertise']
  ];

  useEffect(() => {
    const filledFields = Object.values(input).filter(value => value !== "").length;
    const totalFields = Object.keys(input).length;
    setProgress((filledFields / totalFields) * 100);
  }, [input]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  
  const handleAwardChange = (index, field, value) => {
    const updatedAwards = input.awards.map((award, idx) => 
      idx === index ? { ...award, [field]: value } : award
    );
    setInput({ ...input, awards: updatedAwards });
  };

  const addAward = () => {
    setInput({ ...input, awards: [...input.awards, { awardName: '', link: '', year: '' }] });
  };

  const removeAward = (index) => {
    const updatedAwards = input.awards.filter((_, idx) => idx !== index);
    setInput({ ...input, awards: updatedAwards });
  };

  const handleCheckboxChange = (e, field) => {
    const { checked, value } = e.target;
    setInput((prevInput) => {
      const updatedField = checked
        ? [...prevInput[field], value]
        : prevInput[field].filter((item) => item !== value);
      return { ...prevInput, [field]: updatedField };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach(key => {
      if (Array.isArray(input[key])) {
        input[key].forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, input[key]);
      }
    });
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };
    
    const renderField = (field) => {
      if (field === 'awards') {
        return (
          <div key={field} className="space-y-2">
            <Helmet>
  <title>Update Profile | Keep Your Qualtr Information Current</title>
  <meta name="description" content="Keep your profile information up-to-date. Stay ahead by presenting accurate and relevant details." />
  <meta name="keywords" content="update profile, account information, profile management, user settings, profile updates, professional details, profile accuracy, Qualtr profile changes" />
</Helmet>

            <label className="block text-lg font-semibold text-gray-700">Awards</label>
            {input.awards.map((award, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <input
                  type="text"
                  placeholder="Award Name"
                  value={award.awardName}
                  onChange={(e) => handleAwardChange(index, 'awardName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Link (optional)"
                  value={award.link}
                  onChange={(e) => handleAwardChange(index, 'link', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={award.year}
                  onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md mt-2"
                >
                  Remove Award
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAward}
              className="px-4 py-2 bg-green-600 text-white rounded-md mt-4"
            >
              Add Award
            </button>
          </div>
        );
      }
  else if (field === 'servicesOffered' || field === 'expertise') {
      return (
        <div key={field} className="space-y-2">
          <label className="block text-lg font-semibold text-gray-700">
            {field === 'servicesOffered' ? 'Services Offered' : 'Expertise (Select up to 5)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {digitalMarketingOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={field}
                  value={option}
                  checked={input[field].includes(option)}
                  onChange={(e) => handleCheckboxChange(e, field)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled={field === 'expertise' && input.expertise.length >= 6 && !input.expertise.includes(option)}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={field} className="space-y-2">
          <label htmlFor={field} className="block text-lg font-semibold text-gray-700">
            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </label>
          <input
            id={field}
            name={field}
            value={input[field]}
            onChange={changeEventHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h1>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          {sections[currentSection].map(renderField)}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
