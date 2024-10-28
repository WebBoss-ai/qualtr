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

{/* News and updates Section */}
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
