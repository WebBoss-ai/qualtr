import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { PORTFOLIO_API_END_POINT } from '@/utils/constant';

import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { PlusCircle, Edit2, Trash2, X, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AddPortfolio = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [portfolios, setPortfolios] = useState(user?.profile?.portfolio || []);
    const [portfolio, setPortfolio] = useState({
        title: '',
        challenge: '',
        solution: '',
        result: ''
    });
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState({});

    const portfoliosPerPage = 4;

    useEffect(() => {
        if (user?.profile?.portfolio) {
            setPortfolios(user.profile.portfolio);
        }
    }, [user]);

    const changeHandler = (e) => {
        setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${PORTFOLIO_API_END_POINT}/update`, {
                userId: user._id,
                portfolio,
                editIndex
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(editIndex !== null ? 'Portfolio updated successfully' : 'Portfolio added successfully');
                setPortfolios(res.data.user.profile.portfolio);
                resetForm();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating portfolio");
        } finally {
            setLoading(false);
        }
    };

    const editPortfolio = (index) => {
        const selectedPortfolio = portfolios[index];
        setPortfolio(selectedPortfolio);
        setEditIndex(index);
    };

    const deletePortfolio = async (index) => {
        if (window.confirm("Are you sure you want to delete this portfolio?")) {
            try {
                const res = await axios.post(`${USER_API_END_POINT}/portfolio/delete`, {
                    userId: user._id,
                    portfolioIndex: index
                });
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    toast.success('Portfolio deleted successfully');
                    setPortfolios(res.data.user.profile.portfolio);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Error deleting portfolio");
            }
        }
    };

    const resetForm = () => {
        setPortfolio({ title: '', challenge: '', solution: '', result: '' });
        setEditIndex(null);
    };

    const truncateText = (text, index, field) => {
        if (text.length <= 25) return text;
        return expanded[index] === field ? text : `${text.substring(0, 25)}...`;
    };

    const toggleExpand = (index, field) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: prev[index] === field ? null : field
        }));
    };

    const startIndex = (currentPage - 1) * portfoliosPerPage;
    const currentPortfolios = portfolios.slice(startIndex, startIndex + portfoliosPerPage);

    const totalPages = Math.ceil(portfolios.length / portfoliosPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <Helmet>
        <title>Add Portfolio | Showcase Your Work on Qualtr</title>
      </Helmet>
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                {editIndex !== null ? "Edit Portfolio" : "Add Portfolio"}
            </h2>
            <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {['title', 'challenge', 'solution', 'result'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1">
                                {field === 'title' ? 'Project Title' : `What was the ${field}?`}
                            </label>
                            <input
                                id={field}
                                name={field}
                                value={portfolio[field]}
                                onChange={changeHandler}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                                placeholder={`Enter ${field}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        type="submit"
                        className={`flex items-center justify-center px-6 py-3 ${
                            loading ? 'bg-gray-400' : editIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#17B169] hover:bg-green-600'
                        } text-white font-semibold rounded-lg transition duration-200`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : editIndex !== null ? (
                            <Edit2 className="w-5 h-5 mr-2" />
                        ) : (
                            <PlusCircle className="w-5 h-5 mr-2" />
                        )}
                        {loading ? "Processing..." : editIndex !== null ? "Update Portfolio" : "Add Portfolio"}
                    </button>
                    {editIndex !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center justify-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Portfolios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentPortfolios.map((portfolio, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold text-gray-800">
                                    {truncateText(portfolio.title, index, 'title')}
                                    {portfolio.title.length > 25 && (
                                        <button
                                            onClick={() => toggleExpand(index, 'title')}
                                            className="text-[#495057] ml-2 focus:outline-none"
                                        >
                                            
                                        </button>
                                    )}
                                </h4>
                                <Briefcase className="w-6 h-6 text-[#17B169]" />
                            </div>
                            {['challenge', 'solution', 'result'].map((field) => (
                                <div key={field} className="mb-3">
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </p>
                                    <p className="text-gray-800">
                                        {truncateText(portfolio[field], index, field)}
                                        {portfolio[field].length > 25 && (
                                            <button
                                                onClick={() => toggleExpand(index, field)}
                                                className="text-[#495057] ml-2 focus:outline-none"
                                            >
                                                {expanded[index] === field ? 'Read Less' : 'Read More'}
                                            </button>
                                        )}
                                    </p>
                                </div>
                            ))}
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={() => editPortfolio(startIndex + index)}
                                    className="text-yellow-600 hover:text-yellow-700 focus:outline-none transition duration-150"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => deletePortfolio(startIndex + index)}
                                    className="text-red-600 hover:text-red-700 focus:outline-none transition duration-150"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={goToPreviousPage}
                        className={`px-4 py-2 bg-[#17B169] text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-150 ${
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={goToNextPage}
                        className={`px-4 py-2 bg-[#17B169] text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-150 ${
                            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPortfolio;
