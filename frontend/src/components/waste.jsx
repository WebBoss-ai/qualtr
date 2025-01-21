import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const categories = [
    'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC',
    'Email Marketing', 'Affiliate Marketing', 'Video Marketing',
    'Influencer Marketing', 'Mobile Marketing', 'Analytics'
];

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        salary: '',
        timeline: '',
        companyId: '',
        category: ''
    });
    const [requirementDoc, setRequirementDoc] = useState(null); // For file upload
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector((store) => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectCategoryHandler = (value) => {
        setInput({ ...input, category: value });
    };

    const selectCompanyHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    const fileChangeHandler = (e) => {
        setRequirementDoc(e.target.files[0]); // Store the selected file
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', input.title);
            formData.append('description', input.description);
            formData.append('salary', input.salary);
            formData.append('timeline', input.timeline);
            formData.append('category', input.category);
            formData.append('companyId', input.companyId);
            formData.append('requirement_doc', requirementDoc); // Attach the file

            const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure multipart form-data is used
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/projects');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-screen my-5">
                <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md" encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>I'm looking for...</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                            />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategoryHandler}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Estimated Budget</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                            />
                        </div>
                        <div>
                            <Label>Timeline</Label>
                            <Input
                                type="text"
                                name="timeline"
                                value={input.timeline}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                            />
                        </div>
                        <div>
                            <Label>Upload Requirement Document</Label>
                            <Input
                                type="file"
                                name="requirement_doc"
                                onChange={fileChangeHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            <Select onValueChange={selectCompanyHandler}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" className="my-4">
                        {loading ? <Loader2 className="animate-spin" /> : "Post a Job"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;








<section style={styles.section}>
    <p style={styles.sectionTitle}>Features</p>
    <h2 style={styles.sectionHeading}>
        Our <span style={{ color: '#17B169' }}>Services</span> for Your Business Growth
    </h2>
    <p style={styles.heroSubtitle}>
        We bridge the gap between brands and top-tier digital marketing agencies, offering tailored solutions for your business needs.
    </p>

    <div style={styles.featureGrid}>
        {[
            { icon: '🏷️', title: 'Branding and Identity', description: 'Collaborate with agencies to craft a strong, unique brand identity that connects with your target audience and stands out in the market.' },
            { icon: '📱', title: 'Social Media Marketing', description: 'Engage with creative agencies to develop effective social media strategies that boost your online presence and foster community growth.' },
            { icon: '🔍', title: 'Search Engine Optimization (SEO)', description: 'Work with specialists to optimize your website and increase organic visibility, driving long-term success in search engine rankings.' },
            { icon: '💰', title: 'Pay-Per-Click (PPC) Advertising', description: 'Partner with certified experts to launch targeted ad campaigns that drive high-quality traffic and measurable results.' },
            { icon: '✍️', title: 'Content Marketing', description: 'Create meaningful content through agencies to attract, engage, and convert your audience, building trust and authority in your industry.' },
            { icon: '📧', title: 'Email Marketing', description: 'Build and nurture relationships with tailored email campaigns designed to increase customer loyalty and drive conversions.' },
        ].map((feature, index) => (
            <div key={index} style={styles.featureItem}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <div style={styles.featureContent}>
                    <h3 style={styles.featureTitle}>{feature.title}</h3>
                    <p style={styles.featureDescription}>{feature.description}</p>
                </div>
            </div>
        ))}
    </div>
</section>

{/* News and updates Section */ }
<section className="mb-16 mt-12">
    <h2 className="text-2xl font-bold mb-6">News and updates</h2>
    <div className="bg-green-700 text-white p-6 rounded-lg flex items-center justify-between">
        <div>
            <h3 className="text-xl font-bold mb-2">2023 Impact Report</h3>
            <p>See how Qualtr is transforming the digital marketing landscape</p>
        </div>
        <button className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold">
            Read the report
        </button>
    </div>
</section>




{/* Features Section */ }
                <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                            Our <span className="text-[#17B169]">Services</span> for Your Business Growth
                        </h2>
                        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                            We bridge the gap between brands and top-tier digital marketing agencies, offering tailored solutions for your business needs.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: '🏷️', title: 'Branding and Identity', description: 'Craft a strong, unique brand identity that connects with your target audience.' },
                                { icon: '📱', title: 'Social Media Marketing', description: 'Develop effective social media strategies to boost your online presence.' },
                                { icon: '🔍', title: 'Search Engine Optimization (SEO)', description: 'Optimize your website and increase organic visibility in search rankings.' },
                                { icon: '💰', title: 'Pay-Per-Click (PPC) Advertising', description: 'Launch targeted ad campaigns that drive high-quality traffic and results.' },
                                { icon: '✍️', title: 'Content Marketing', description: 'Create meaningful content to attract, engage, and convert your audience.' },
                                { icon: '📧', title: 'Email Marketing', description: 'Build and nurture relationships with tailored email campaigns.' },
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


<Avatar className="h-24 w-24">
                            <AvatarImage src={profile?.profile?.profilePhoto || 'https://via.placeholder.com/150'} alt="profile" />
                        </Avatar>
                        




                                    <ExperiencesPage profileData={profileData} setProfileData={setProfileData} />
                                    <EducationPage profileData={profileData} setProfileData={setProfileData} />
                        
                                    <button onClick={() =>setModalOpen1(true)}>Edit Experience</button>
                                    <ExperiencesModal
                                        isOpen={isModalOpen1}
                                        onClose={() => setModalOpen1(false)}
                                        initialExperiences={experiences}
                                        experiences={selectedExperiences}
                                    />
                        
                                    <button onClick={() => setModalOpen2(true)}>Edit Education</button>
                                    <EducationModal
                                        isOpen={isModalOpen2}
                                        onClose={() => setModalOpen2(false)}
                                        initialEducation={education}
                                        education={selectedEducation}
                                    />



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import ExperiencesModal from './ExperiencesModal';
import EducationModal from './EducationModal';
import ExperiencesPage from './ExperiencesPage';
import EducationPage from './EducationPage';

const MarketerUpdateProfile = () => {
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneNumber: '',
        agencyName: '',
        bio: '',
        skills: '',
        location: '',
        profilePhoto: '',
        experiences: [],
        education: [],
    });

    const [selectedExperiences, setSelectedExperiences] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);

    const [isModalOpen1, setModalOpen1] = useState(false);
    const experiences = []; // Fetch or pass initial experiences

    const [isModalOpen2, setModalOpen2] = useState(false);
    const education = []; // Fetch or pass initial experiences

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const token = localStorage.getItem('token');

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            throw new Error('Invalid or expired token. Please log in again.');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                if (!token) {
                    throw new Error('Token is not available. Please log in.');
                }

                const decodedToken = decodeToken(token);
                const userId = decodedToken.userId;
                if (!userId) {
                    throw new Error('User ID is not found in the token.');
                }

                const endpoint = `${MARKETER_API_END_POINT}/profile/${userId}`;
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfileData(res.data.profile || {
                    fullname: '',
                    phoneNumber: '',
                    agencyName: '',
                    bio: '',
                    skills: '',
                    location: '',
                    profilePhoto: '',
                    experiences: [],
                    education: [],
                });
                setSuccess('Profile loaded successfully.');
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            for (const key in profileData) {
                if (key === 'profilePhoto' && profileData[key]) {
                    formData.append(key, profileData[key]);
                } else {
                    formData.append(key, profileData[key]);
                }
            }

            const res = await axios.post(`${MARKETER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Profile</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="fullname"
                    value={profileData.fullname}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                />
                <input
                    type="text"
                    name="agencyName"
                    value={profileData.agencyName}
                    onChange={handleChange}
                    placeholder="Agency Name"
                    required
                />
                <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Bio"
                />
                <input
                    type="text"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                />
                <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
                <input
                    type="file"
                    name="profilePhoto"
                    onChange={(e) =>
                        setProfileData((prevData) => ({
                            ...prevData,
                            profilePhoto: e.target.files[0],
                        }))
                    }
                />
                <button type="submit" disabled={loading}>Update Profile</button>
            </form>

            <ExperiencesPage profileData={profileData} setProfileData={setProfileData} />
            <EducationPage profileData={profileData} setProfileData={setProfileData} />

            <button onClick={() => setModalOpen1(true)}>Edit Experience</button>
            <ExperiencesModal
                isOpen={isModalOpen1}
                onClose={() => setModalOpen1(false)}
                initialExperiences={experiences}
                experiences={selectedExperiences}
            />

            <button onClick={() => setModalOpen2(true)}>Edit Education</button>
            <EducationModal
                isOpen={isModalOpen2}
                onClose={() => setModalOpen2(false)}
                initialEducation={education}
                education={selectedEducation}
            />
        </div>
    );
};

export default MarketerUpdateProfile;

import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const locationTypes = ["On-site", "Remote", "Hybrid"];

const ExperiencesPage = ({ profileData, fetchProfileData }) => {
    const [editingExperience, setEditingExperience] = useState(null);
    const [updatedExperience, setUpdatedExperience] = useState({});

    const handleEditExperiences = (experience) => {
        setEditingExperience(experience);
        setUpdatedExperience({
            ...experience,
            startDate: experience.startDate
                ? new Date(experience.startDate.year, experience.startDate.month - 1)
                : null,
            endDate: experience.endDate
                ? new Date(experience.endDate.year, experience.endDate.month - 1)
                : null,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setUpdatedExperience((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleSaveEdit = async () => {
        const formatToDateObject = (date) => ({
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            year: date.getFullYear().toString(),
        });

        const updatedData = {
            ...updatedExperience,
            startDate: updatedExperience.startDate
                ? formatToDateObject(updatedExperience.startDate)
                : null,
            endDate: updatedExperience.endDate
                ? formatToDateObject(updatedExperience.endDate)
                : null,
        };

        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/edit-experience`, {
                experienceId: editingExperience._id,
                updatedExperience: updatedData,
            });

            if (response.data.success) {
                fetchProfileData(); // Fetch updated profile data
                setEditingExperience(null);
            } else {
                console.error("Error in saving edit:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating experience:", error);
        }
    };

    const handleDeleteExperiences = async (experienceId) => {
        try {
            const response = await axios.delete(`${MARKETER_API_END_POINT}/delete-experience/${experienceId}`);

            if (response.data.success) {
                fetchProfileData(); // Refresh the data
            } else {
                console.error("Error in deleting experience:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    if (!profileData || !profileData.experiences) {
        return <p>Loading...</p>; // Show a loading state if profileData is not available
    }

    return (
        <div>
            <h3>Experiences</h3>
            {profileData.experiences.length > 0 ? (
                <ul>
                    {profileData.experiences.map((exp, index) => (
                        <li key={index}>
                            <p>
                                <strong>Title:</strong> {exp.title}
                            </p>
                            <p>
                                <strong>Company:</strong> {exp.company}
                            </p>
                            <p>
                                <strong>Employment Type:</strong> {exp.employmentType}
                            </p>
                            <p>
                                <strong>Location:</strong> {exp.location} ({exp.locationType})
                            </p>
                            <p>
                                <strong>Duration:</strong>{" "}
                                {exp.startDate
                                    ? `${exp.startDate.month}/${exp.startDate.year}`
                                    : "N/A"}{" "}
                                -{" "}
                                {exp.isCurrent
                                    ? "Present"
                                    : exp.endDate
                                        ? `${exp.endDate.month}/${exp.endDate.year}`
                                        : "N/A"}
                            </p>
                            {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
                            <button onClick={() => handleEditExperiences(exp)}>Edit</button>
                            <button onClick={() => handleDeleteExperiences(exp._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No experiences listed.</p>
            )}

            {editingExperience && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Experience</h4>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={updatedExperience.title || ""}
                            onChange={handleChange}
                        />
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={updatedExperience.company || ""}
                            onChange={handleChange}
                        />
                        <label>Employment Type</label>
                        <select
                            name="employmentType"
                            value={updatedExperience.employmentType || ""}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select an option</option>
                            {employmentTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={updatedExperience.location || ""}
                            onChange={handleChange}
                        />
                        <label>Location Type</label>
                        <select
                            name="locationType"
                            value={updatedExperience.locationType || ""}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select an option</option>
                            {locationTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <label>Start Date</label>
                        <DatePicker
                            selected={updatedExperience.startDate}
                            onChange={(date) => handleDateChange("startDate", date)}
                            dateFormat="yyyy-MM"
                            showMonthYearPicker
                        />
                        <label>End Date</label>
                        <DatePicker
                            selected={updatedExperience.endDate}
                            onChange={(date) => handleDateChange("endDate", date)}
                            dateFormat="yyyy-MM"
                            showMonthYearPicker
                            disabled={updatedExperience.isCurrent}
                        />
                        <label>Is Current</label>
                        <input
                            type="checkbox"
                            name="isCurrent"
                            checked={updatedExperience.isCurrent || false}
                            onChange={(e) =>
                                setUpdatedExperience((prev) => ({
                                    ...prev,
                                    isCurrent: e.target.checked,
                                }))
                            }
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingExperience(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperiencesPage;
