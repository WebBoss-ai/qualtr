import React from 'react';
import { Helmet } from 'react-helmet';
import { FaSearch, FaCheckCircle, FaClock, FaCogs } from 'react-icons/fa';
import img1 from '../images/img1.png'
import img2 from '../images/img2.png'
import img3 from '../images/img3.png'
import img4 from '../images/img4.png'
import imgHome from '../images/img_home.jpg'
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import styled from 'styled-components';

import dev from '../images/logos/dev.png'
import dawdle from '../images/logos/dawdle.jpg'
import deeptrue from '../images/logos/deeptrue.jpg'
import InsightAssess from '../images/logos/InsightAssess.jpg'
import techdev_white from '../images/logos/techdev_white.png'


const ResponsiveHome = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Helmet>
                <title>Qualtr | Discover Top Marketing Agencies & Brand Partnerships</title>
            </Helmet>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Connect with <span className="text-[#17B169]">Marketing Agencies</span> on Qualtr.
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">Find the perfect agency to elevate your brand.</p>
                            <button
                                className="bg-transparent text-[#006241] px-6 py-2 font-semibold border-2 border-[#006241] rounded-[5px] hover:bg-[#006241] hover:text-white transition duration-300"
                                onClick={() => window.location.href = '/admin/projects'}
                            >
                                Get Started
                            </button>

                            <p className="mt-8 text-sm font-semibold text-gray-500">OUR TRUSTED CUSTOMERS</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                {/* Add customer logos here */}
                                <img src={dev} alt="Customer 1" className="h-10 w-auto mx-auto" />
                                <img src={deeptrue} alt="Customer 2" className="h-10 w-auto mx-auto" />
                                <img src={dawdle} alt="Customer 3" className="h-10 w-auto mx-auto" />
                                <img src={InsightAssess} alt="Customer 4" className="h-10 w-auto mx-auto" />
                            </div>


                        </div>
                        <div className="md:w-1/2">
                            <img src={img1} alt="Hero Illustration" className="w-full h-auto object-cover max-h-96" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
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

                {/* Quality Work Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        {/* Content Section */}
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Start Getting Projects on <span className="text-[#17B169]">Qualtr</span> as a <span className="text-[#17B169]">Top Agency.</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Join our platform to connect with brands looking for your expertise. Qualtr helps agencies grow their business by matching them with the right projects and clients.
                            </p>
                            <button
                                className="bg-transparent text-[#006241] px-6 py-2 font-semibold border-2 border-[#006241] rounded-[5px] hover:bg-[#006241] hover:text-white transition duration-300"
                                onClick={() => window.location.href = '/open-projects'}
                            >
                                Start Getting Projects
                            </button>
                        </div>

                        {/* Image Section */}
                        <div className="md:w-1/2">
                            <img
                                src={imgHome}
                                alt="Agency working on projects"
                                className="w-400 h-300 rounded-lg object-cover"
                                style={{ width: '500px', height: '350px', float: "right" }}
                            />
                        </div>
                    </div>
                </section>


                {/* Steps Section */}
                <section className="py-10 px-4 md:px-8 lg:px-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2">
                            <img
                                src={img2}
                                alt="Steps Illustration"
                                className="w-400 h-300 rounded-lg object-cover"
                                style={{ width: '500px', height: '350px', float: "left" }}
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                Easy to <span className="text-[#17B169]">Get Started.</span>
                            </h2>
                            {[
                                { number: '01', title: 'Create a Project', description: 'Describe your project goals, budget, and timeline.' },
                                { number: '02', title: 'Receive Proposals', description: 'Get tailored proposals from qualified agencies.' },
                                { number: '03', title: 'Choose the Best Fit', description: 'Review proposals, and select your best agency' },
                            ].map((step, index) => (
                                <div key={index} className="flex items-start mb-8">
                                    <div className="bg-[#17B169] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-light">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex space-x-4">
                                <button onClick={() => window.location.href = '/agencies'} className="bg-[#17B169] text-white px-6 py-2 rounded-[5px] font-semibold hover:bg-green-600 transition duration-300">
                                    Get Started
                                </button>
                                <button onClick={() => window.location.href = '/how-to-hire'} className="border-2 border-[#17B169] text-[#17B169] px-6 py-2 rounded-[5px] font-semibold hover:bg-[#17B169] hover:text-white transition duration-300">
                                    Get Consultancy
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                We Always Abide by Our <span className="text-[#17B169]">Principles.</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                At Qualtr, we are committed to delivering exceptional value and service through our core principles.
                            </p>
                            {[
                                { icon: FaSearch, title: 'Transparency', description: 'We believe in open communication and transparency throughout the process.' },
                                { icon: FaCheckCircle, title: 'Quality', description: 'We prioritize quality work and results-driven strategies to exceed your expectations.' },
                                { icon: FaClock, title: 'Efficiency', description: 'We streamline the agency selection process to save you time and effort.' },
                                { icon: FaCogs, title: 'Customization', description: 'We tailor our services to meet your specific needs and goals.' },
                            ].map((value, index) => (
                                <div key={index} className="flex items-start mb-6">
                                    <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                                        <value.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-light">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="bg-transparent text-[#006241] px-6 py-2 mt-10 font-semibold border-2 border-[#006241] rounded-[5px] hover:bg-[#006241] hover:text-white transition duration-300"
                                onClick={() => window.location.href = '/impact'}
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="md:w-1/2 md:pl-12">
                            <img src={img3} alt="Values Illustration" className="w-full h-auto" />
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">
                            Our Clients <span className="text-[#17B169]">Love Us.</span>
                        </h2>

                        {/* Testimonial 1 */}
                        <blockquote className="text-2xl italic text-gray-600 mb-8">
                            "Qualtr transformed our marketing strategy by connecting us with the best agency in the industry. Their platform is seamless and easy to use!"
                        </blockquote>
                        <p className="font-semibold">DeepTrue</p>
                        <p className="text-gray-500">~Consumer Surveys in Minutes</p>
                    </div>
                </section>


                {/* Enterprise Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-100 flex justify-center">
                    <div className="max-w-7xl w-full bg-[#036666] text-white rounded-[12px] shadow-lg p-8 md:p-12 lg:p-16">
                        <div className="flex flex-col md:flex-row items-center">
                            {/* Text Section */}
                            <div className="md:w-1/2 mb-10 md:mb-0">
                                <h2 className="text-2xl md:text-4xl font-bold mb-6">
                                    This is how <span className="text-green-300">brands</span> connect with{' '}
                                    <span className="text-green-300">trusted agencies</span>.
                                </h2>
                                <p className="text-xl mb-8">
                                    Qualtr connects brands with 100+ handpicked agencies, ensuring seamless project completion.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center">
                                        <FaCheckCircle className="text-green-300 mr-2" />
                                        Discover the best fit agency from our trusted network
                                    </li>
                                    <li className="flex items-center">
                                        <FaCheckCircle className="text-green-300 mr-2" />
                                        Enjoy seamless project management with dedicated support
                                    </li>
                                    <li className="flex items-center">
                                        <FaCheckCircle className="text-green-300 mr-2" />
                                        Rely on Qualtr for guaranteed project delivery
                                    </li>
                                </ul>
                                <button
                                    onClick={() => window.location.href = '/impact'}
                                    className="bg-white text-[#006241] px-6 py-2 rounded-[10px] font-semibold hover:bg-[#17B169] hover:text-white transition duration-300">
                                    Learn More
                                </button>
                            </div>
                            {/* Image Section */}
                            <div className="md:w-1/2 md:pl-12">
                                <img src={img4} alt="Qualtr Connecting Brands and Agencies" className="w-full h-auto rounded-[12px]" />
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default ResponsiveHome;