import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import logo from '../../images/logo.png'
import img_impact_1 from '../../images/img_impact_1.jpg'
import img_impact_2 from '../../images/img_impact_2.jpg'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const OurImpact = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const focusAreas = [
        { icon: "🤝", title: "Agency Partnerships", description: "Our platform nurtures strategic partnerships between agencies and brands, fostering collaborations that drive growth and success." },
        { icon: "🎯", title: "Brand Success", description: "We prioritize the growth of brands by connecting them with agencies that have a proven track record in delivering exceptional results." },
        { icon: "🌐", title: "Global Reach", description: "Expanding the horizons for brands and agencies alike by offering global opportunities and connections." },
        { icon: "📊", title: "Data-Driven Matching", description: "Using sophisticated algorithms to match brands with agencies based on insights and past success metrics." },
        { icon: "🚀", title: "Innovation", description: "We embrace the latest trends and technologies to keep our platform and partnerships ahead of the curve." },
        { icon: "🛡️", title: "Trust & Security", description: "Building a safe environment for all stakeholders with transparency and a commitment to data protection." },
    ];

    const openModal = (item) => {
        setModalContent(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({});
    };
    return (
        <div>
            <Helmet>
  <title>Our Impact | Success Stories with Brands and Agencies</title>
  <meta name="description" content="Explore success stories from brands and agencies using Qualtr. See how we drive impactful partnerships." />
  <meta name="keywords" content="our impact, success stories, brand-agency partnerships, impactful collaborations, Qualtr achievements" />
</Helmet>

            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-start md:items-center mb-16 mt-12">
                    <img
                        src={logo}
                        alt="CEO"
                        className="w-32 h-32 object-cover rounded-[10px] mb-4 md:mb-0 md:mr-8"
                        style={{ width: '128px', height: '128px' }} 
                    />
                    <blockquote className="text-lg md:text-xl text-green-700 font-medium ml-4">
                        "Our mission is to create seamless connections between brands and digital marketing agencies. We believe in the power of collaboration to drive extraordinary results. It's not just about matching; it's about creating partnerships that thrive."
                        <footer className="text-sm text-gray-600 mt-2">- Qualtr</footer>
                    </blockquote>
                </div>

                <section className="mb-16 mt-12">
                    <h2 className="text-2xl font-bold mb-6">What we're focusing on</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {focusAreas.map((item, index) => (
                            <div key={index} className="bg-green-50 p-4 rounded-lg">
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <button
                                    onClick={() => openModal(item)}
                                    className="text-green-700 text-sm flex items-center mt-2"
                                >
                                    Learn More <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg mx-4 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                            >
                                <X size={24} />
                            </button>
                            <div className="text-5xl mb-6">{modalContent.icon}</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{modalContent.title}</h3>
                            <p className="text-gray-600">{modalContent.description}</p>
                            <div className="mt-6">
                                <button
                                    onClick={closeModal}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-[12px] transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Hire for Impact Section */}
                <section className="mb-16 mt-12 bg-gray-100 p-6 rounded-lg flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold mb-2">Connect for Impact</h2>
                        <p className="mb-4">Find the perfect digital marketing agency to elevate your brand and drive results.</p>
                        <Link to="/agencies">
                            <button className="bg-green-700 text-white px-6 py-2 rounded-[10px] font-semibold">
                                Start Matching
                            </button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src={img_impact_1}
                            alt="Connect for Impact"
                            className="w-400 h-300 rounded-lg object-cover"
                            style={{ width: '400px', height: '300px' }} // Inline style for exact dimensions
                        />
                    </div>

                </section>

                {/* Opportunity Unlimited Section */}
                <section className="mb-16 mt-12 bg-yellow-100 p-6 rounded-lg flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold mb-2">Opportunity Unlimited</h2>
                        <p className="mb-4">Agencies, join our network and connect with brands looking for your expertise.</p>
                        <Link to="/login">
                            <button className="bg-yellow-500 text-white px-6 py-2 rounded-[10px] font-semibold">
                                Join Qualtr
                            </button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src={img_impact_2}
                            alt="Connect for Impact"
                            className="w-400 h-300 rounded-lg object-cover"
                            style={{ width: '400px', height: '300px' }} // Inline style for exact dimensions
                        />
                    </div>
                </section>

                {/* Learn more about us Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Learn more about us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: "📊", title: "Help & Support", url: "/support" },
                            { icon: "🤝", title: "Success Stories", url: "/success-stories" },
                            { icon: "💼", title: "Qualtr Carrers", url: "/carrers" },
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <a
                                    href={item.url}
                                    className="text-green-700 text-sm flex items-center mt-2"
                                >
                                    Learn More <ChevronRight size={16} className="ml-1" />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
};

export default OurImpact;