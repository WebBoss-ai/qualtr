import React from 'react';
import { Star, Search, DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';
import img_htfw_1 from '../../images/img_htfw_1.jpg'
import img_htfw_2 from '../../images/img_htfw_2.jpg'
import { Link } from 'react-router-dom';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';
import { Helmet } from 'react-helmet';

const HowToFindWork = () => {
    return (
        <div>
            <Helmet>
        <title>How to Find Work | Tips for Agencies</title>
      </Helmet>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center mb-16">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Find your next client on Qualtr
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Connect with brands seeking top digital marketing expertise, all on our secure platform.
                        </p>
                        <Link to="/login">
                            <button className="bg-[#17B169] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-green-600 transition duration-300">
                                Join Qualtr
                            </button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src={img_htfw_1}
                            alt="Digital Marketing Agency"
                            className="w-400 h-300 rounded-lg object-cover"
                            style={{ width: '500px', height: '350px', float: 'right' }} // Inline style for exact dimensions
                        />
                    </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center justify-center mb-16">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 w-6 h-6" />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600">4.9/5 rating from 1000+ agencies</span>
                </div>

                {/* How it works Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Create your agency profile",
                                description: "Showcase your expertise, portfolio, and services to attract the right clients.",
                                icon: <Users className="w-12 h-12 text-green-500" />,
                            },
                            {
                                title: "Explore opportunities",
                                description: "Browse projects from top brands or get matched based on your skills and experience.",
                                icon: <Search className="w-12 h-12 text-green-500" />,
                            },
                            {
                                title: "Collaborate and earn",
                                description: "Work on exciting projects and get paid securely through our platform.",
                                icon: <DollarSign className="w-12 h-12 text-green-500" />,
                            },
                        ].map((step, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="mb-4">{step.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Explore ways to earn Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore ways to earn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Find your next project</h3>
                            <p className="text-gray-600 mb-4">
                                Browse a wide range of digital marketing projects from top brands. Filter by your expertise, budget, and project duration.
                            </p>
                            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                                <input
                                    type="text"
                                    placeholder="Search for projects (e.g., SEO, PPC, Social Media)"
                                    className="flex-grow bg-transparent border-none focus:outline-none"
                                />
                                <Search className="text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Showcase your expertise</h3>
                            <p className="text-gray-600 mb-4">
                                Highlight your agency's strengths, case studies, and client testimonials to stand out from the competition.
                            </p>
                            <Link to='/profile'>
                                <button className="bg-[#17B169] text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-green-600 transition duration-300">
                                    Create your profile
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How payments work Section */}
                <section className="mb-16 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How payments work</h2>
                            <p className="text-gray-600 mb-4">
                                Qualtr ensures you get paid fairly and on time for your work. Our secure payment system protects both agencies and clients.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <DollarSign className="text-green-500 mr-2" />
                                    <span>Secure escrow payments</span>
                                </li>
                                <li className="flex items-center">
                                    <Briefcase className="text-green-500 mr-2" />
                                    <span>Milestone-based releases</span>
                                </li>
                                <li className="flex items-center">
                                    <TrendingUp className="text-green-500 mr-2" />
                                    <span>Competitive rates</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src={img_htfw_2}
                                alt="Digital Marketing Agency"
                                className="w-400 h-300 rounded-lg object-cover"
                                style={{ width: '500px', height: '350px', float: 'right' }} // Inline style for exact dimensions
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center">
                    <p className="text-gray-600 mb-4">Trusted by leading digital marketing agencies</p>
                    <div className="flex justify-center space-x-8">
                        {['DigitalBoost', 'GrowthHackers', 'SEOMasters', 'SocialPro', 'ContentKings'].map((agency) => (
                            <span key={agency} className="text-gray-400 font-semibold">{agency}</span>
                        ))}
                    </div>
                </footer>
            </div>

            <Footer />
        </div>

    );
};

export default HowToFindWork;