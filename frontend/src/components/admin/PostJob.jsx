import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import ProgressBar from '../ui/ProgressBar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import img5 from '../../images/img5.png'
import { Helmet } from 'react-helmet';

// Define categories
const categories = [
    'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
    'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
    'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
    'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
    'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management',
];

// Define total steps
const totalSteps = 7;

const PostJob = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [input, setInput] = useState({ title: '', description: '', salary: '', timeline: '', category: '', company: '' });
    const [requirementDoc, setRequirementDoc] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector((store) => store.company);

    // Validate step inputs
    const validateStep = (step) => {
        const stepErrors = {};
        if (step === 1 && !input.title) stepErrors.title = 'Title is required';
        if (step === 2 && !input.description) stepErrors.description = 'Description is required';
        if (step === 4 && !input.salary) stepErrors.salary = 'Budget is required';
        if (step === 5 && !input.timeline) stepErrors.timeline = 'Timeline is required';
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    // Move to next step if validation passes
    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    // Move to previous step
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Handle input change and clear error on change
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
    };
    const selectCategoryHandler = (value) => {
        setInput({ ...input, category: value });
    };

    const selectCompanyHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany?._id }); // Update to use companyId
    };
    
    const fileChangeHandler = (e) => {
        setRequirementDoc(e.target.files[0]); // Store the selected file
    };

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('title', input.title);
                formData.append('description', input.description);
                formData.append('salary', input.salary);
                formData.append('timeline', input.timeline);
                formData.append('category', input.category);
                formData.append('companyId', input.companyId); // Append companyId correctly
    
                if (requirementDoc) formData.append('requirement_doc', requirementDoc);
    
                const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
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
        }
    };
    

    // Render steps
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                     <Helmet>
  <title>Post a New Project | Find Marketing Experts on Qualtr</title>
  <meta name="description" content="Post your project on Qualtr to connect with top marketing agencies. Share details and attract expert bids tailored to your needs." />
  <meta name="keywords" content="post a new project, find marketing experts, project submissions, agency bids, marketing collaborations, expert marketers" />
</Helmet>

                        <Label>I'm looking for...</Label>
                        <Input
                            type="text"
                            name="title"
                            value={input.title}
                            onChange={changeEventHandler}
                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        <p className="text-sm text-gray-500">Please provide the project title. This will help attract the right agencies.</p>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        <p className="text-sm text-gray-500">Provide a detailed description of the job, responsibilities, and requirements.</p>
                    </div>
                );
            case 3:
                return (
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
                        <p className="text-sm text-gray-500">Select the category that best fits your project.</p>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <Label>Estimated Budget</Label>
                        <Input
                            type="text"
                            name="salary"
                            value={input.salary}
                            onChange={changeEventHandler}
                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                        />
                        {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
                        <p className="text-sm text-gray-500">Enter the expected budget for this project.</p>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <Label>Timeline</Label>
                        <Input
                            type="text"
                            name="timeline"
                            value={input.timeline}
                            onChange={changeEventHandler}
                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                        />
                        {errors.timeline && <p className="text-sm text-red-500">{errors.timeline}</p>}
                        <p className="text-sm text-gray-500">Provide an estimated timeline for completing the job.</p>
                    </div>
                );
            case 6:
                return (
                    <div>
                        <Label>Upload Requirement Document</Label>
                        <Input
                            type="file"
                            name="requirement_doc"
                            onChange={(e) => setRequirementDoc(e.target.files[0])}
                            className="focus-visible:ring-offset-0 focus-visible:ring-0 my-2"
                        />
                        <p className="text-sm text-gray-500">Upload any relevant documents that provide more details about the job.</p>
                    </div>
                );
            case 7:
                return (
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
                        <p className="text-sm text-gray-500">Select the company that is posting this job.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col sm:flex-row items-center justify-center w-screen my-5 px-4">
                <div className="flex w-full py-20 max-w-4xl flex-col sm:flex-row">
                    {/* Left Side with Image */}
                    <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-100">
                        <img src={img5} alt="Guide Image" className="max-h-[400px] object-contain" />
                    </div>

                    {/* Right Side with Form */}
                    <div className="w-full sm:w-1/2 p-8">
                        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

                        <form onSubmit={submitHandler} className="mt-4">
                            {renderStep()}

                            <div className="flex justify-between mt-6">
                                {currentStep > 1 && (
                                    <Button
                                        onClick={prevStep}
                                        className="bg-[#17B169] text-white hover:bg-[#006241] border-none"
                                    >
                                        Previous
                                    </Button>
                                )}

                                {currentStep < totalSteps && (
                                    <Button
                                        onClick={nextStep}
                                        className="bg-[#17B169] text-white hover:bg-[#006241] border-none"
                                    >
                                        Next
                                    </Button>
                                )}

                                {currentStep === totalSteps && (
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className={`bg-[#17B169] text-white hover:bg-[#006241] border-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                                    </Button>
                                )}

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostJob;
