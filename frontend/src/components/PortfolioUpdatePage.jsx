import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { PORTFOLIO_API_END_POINT } from '@/utils/constant';

const PortfolioUpdatePage = () => {
    const [portfolioItem, setPortfolioItem] = useState({
        title: '',
        challenge: '',
        solution: '',
        result: '',
        projectDuration: '',
        technologiesUsed: '',
        images: [],
        link: '',
        testimonials: ''
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPortfolioItem({ ...portfolioItem, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPortfolioItem({ ...portfolioItem, images: files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(portfolioItem).forEach(key => {
            if (Array.isArray(portfolioItem[key])) {
                portfolioItem[key].forEach(item => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, portfolioItem[key]);
            }
        });
        
        try {
            setLoading(true);
            const response = await axios.post(`${PORTFOLIO_API_END_POINT}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Portfolio updated successfully');
            dispatch({ type: 'UPDATE_PORTFOLIO', payload: response.data });
        } catch (error) {
            toast.error('Error updating portfolio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Update Portfolio</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="title" className="font-semibold">Project Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={portfolioItem.title}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="e.g., SEO Campaign for XYZ Company"
                            />
                        </div>
                        <div>
                            <Label htmlFor="challenge" className="font-semibold">Challenge</Label>
                            <textarea
                                id="challenge"
                                name="challenge"
                                value={portfolioItem.challenge}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="Describe the problem or challenge faced by the client"
                            ></textarea>
                        </div>
                        <div>
                            <Label htmlFor="solution" className="font-semibold">Solution</Label>
                            <textarea
                                id="solution"
                                name="solution"
                                value={portfolioItem.solution}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="Explain the solution your team provided"
                            ></textarea>
                        </div>
                        <div>
                            <Label htmlFor="result" className="font-semibold">Result</Label>
                            <textarea
                                id="result"
                                name="result"
                                value={portfolioItem.result}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="Describe the result achieved after implementing the solution"
                            ></textarea>
                        </div>
                        <div>
                            <Label htmlFor="projectDuration" className="font-semibold">Project Duration</Label>
                            <Input
                                id="projectDuration"
                                name="projectDuration"
                                value={portfolioItem.projectDuration}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="e.g., 6 months"
                            />
                        </div>
                        <div>
                            <Label htmlFor="technologiesUsed" className="font-semibold">Technologies Used</Label>
                            <Input
                                id="technologiesUsed"
                                name="technologiesUsed"
                                value={portfolioItem.technologiesUsed}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="e.g., React, SEO tools"
                            />
                        </div>
                        <div>
                            <Label htmlFor="images" className="font-semibold">Portfolio Images</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="p-2 mt-1 border rounded-lg"
                            />
                        </div>
                        <div>
                            <Label htmlFor="link" className="font-semibold">Project Link (Optional)</Label>
                            <Input
                                id="link"
                                name="link"
                                value={portfolioItem.link}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="e.g., https://yourproject.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="testimonials" className="font-semibold">Testimonials</Label>
                            <textarea
                                id="testimonials"
                                name="testimonials"
                                value={portfolioItem.testimonials}
                                onChange={handleInputChange}
                                className="p-2 mt-1 border rounded-lg"
                                placeholder="Include any client feedback"
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button type="submit" className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
                            {loading ? 'Updating...' : 'Update Portfolio'}
                        </Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default PortfolioUpdatePage;
