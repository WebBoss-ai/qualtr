import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { JOB_SEEKER_API_END_POINT } from "@/utils/constant";
import { Star, Globe, DollarSign, Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Badge } from './ui/badge';
import { FaSearch, FaCheckCircle, FaClock, FaCogs } from 'react-icons/fa';
import img1 from '../images/img1.png'
import img2 from '../images/img2.png'
import img3 from '../images/img3.png'
import img4 from '../images/img4.png'
import imgHome from '../images/img_home.jpg'
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
import dev from '../images/logos/dev.png'
import dawdle from '../images/logos/dawdle.jpg'
import deeptrue from '../images/logos/deeptrue.jpg'
import InsightAssess from '../images/logos/InsightAssess.jpg'
import techdev_white from '../images/logos/techdev_white.png'


const ResponsiveHome = () => {
    const { user } = useSelector(store => store.auth)

    const [randomJobSeekers, setRandomJobSeekers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${JOB_SEEKER_API_END_POINT}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const validJobSeekers = data.jobSeekers.filter(
                        (jobSeeker) => jobSeeker?.profile?.agencyName
                    );
                    const shuffledJobSeekers = validJobSeekers.sort(() => 0.5 - Math.random());
                    setRandomJobSeekers(shuffledJobSeekers.slice(0, 6));
                }
            })
            .catch((error) => console.error("Error fetching job seekers:", error))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="font-sans text-gray-900 bg-white">
            <Helmet>
                {/* Title */}
                <title>Qualtr | Connect with Top Digital Marketing Agencies</title>

                {/* Meta Descriptions */}
                <meta name="description" content="Find and connect with top-rated digital marketing agencies on Qualtr. Explore agency profiles, compare services, and build successful brand partnerships today!" />
                <meta name="keywords" content="digital marketing agencies, brand partnerships, top marketing agencies, marketing services, agency reviews, marketing solutions, find agencies" />
                <meta name="author" content="Qualtr" />

                {/* Open Graph / Social Sharing */}
                <meta property="og:title" content="Qualtr | Connect with Top Digital Marketing Agencies" />
                <meta property="og:description" content="Qualtr helps you connect with trusted digital marketing agencies. Compare services, read reviews, and find the perfect match for your brand." />
                <meta property="og:image" content="https://www.qualtr.com/images/qualtr-og-image.jpg" />
                <meta property="og:url" content="https://www.qualtr.com" />
                <meta property="og:type" content="website" />

                {/* Twitter Card Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Qualtr | Connect with Top Digital Marketing Agencies" />
                <meta name="twitter:description" content="Find trusted digital marketing agencies on Qualtr. Start your next marketing campaign with the best in the business!" />
                <meta name="twitter:image" content="https://www.qualtr.com/images/qualtr-twitter-image.jpg" />

                {/* Favicon and Theme */}
                <link rel="icon" href="/Q.ico" />
                <meta name="theme-color" content="#17B169" />

                {/* Robots Meta */}
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://www.qualtr.com" />

                {/* Additional Metadata */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="rating" content="general" />
            </Helmet>

            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="py-20 px-4 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Connect with{" "}
                                <span className="text-[#17B169]">
                                    {user?.role === 'student' ? "Brands" : "Marketing Agencies"}
                                </span>{" "}
                                on Qualtr.
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                {user?.role === 'student'
                                    ? "Find the perfect brand to collaborate with and showcase your skills."
                                    : "Find the perfect agency to elevate your brand."}
                            </p>

                            <button
                                className="bg-transparent text-[#006241] px-6 py-2 font-semibold border-2 border-[#006241] rounded-[5px] hover:bg-[#006241] hover:text-white transition duration-300"
                                onClick={() => {
                                    if (!user) {
                                        window.location.href = '/login';
                                    } else if (user.role === 'student') {
                                        window.location.href = '/open-projects';
                                    } else if (user.role === 'recruiter') {
                                        window.location.href = '/agencies';
                                    }
                                }}
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

                <main className="py-14 px-4 md:px-8 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Our <span className="text-[#17B169]">Featured Marketing Agencies</span> for Your Business Growth</h1>
                        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                            We bridge the gap between brands and top-tier digital marketing agencies, offering tailored solutions for your business needs.
                        </p>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {randomJobSeekers.map((jobSeeker) => (
                                    <div
                                        key={jobSeeker._id}
                                        className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:border-[#17B169] transition-border duration-300"
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                    <a href={`/agency/${jobSeeker._id}`}>
                                                        <img
                                                            src={jobSeeker.profile.profilePhoto || "https://via.placeholder.com/40"}
                                                            alt={`${jobSeeker?.profile?.agencyName || "Agency"} logo`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </a>
                                                </div>
                                                <div>
                                                    <a href={`/agency/${jobSeeker._id}`}>
                                                        <h2 className="text-lg font-semibold text-gray-900 leading-tight hover:text-[#17B169] transition-colors duration-200">
                                                            {(jobSeeker?.profile?.agencyName?.slice(0, 20) || "Unknown Agency")}
                                                        </h2>
                                                    </a>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {(jobSeeker?.profile?.slogan?.slice(0, 30) + "..." || "Innovating for tomorrow")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                <div className="flex items-center text-gray-700">
                                                    <Globe className="h-4 w-4 text-green-500 mr-1" />
                                                    <span>Year Founded: {jobSeeker?.profile?.yearFounded || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <MapPin className="h-4 w-4 text-red-500 mr-1" />
                                                    <span className="truncate">{jobSeeker.profile.location || "Remote"}</span>
                                                </div>
                                                <div className="col-span-2 rounded-lg" style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}>
                                                    <div className="flex gap-2 mt-3">
                                                        {jobSeeker?.profile?.expertise?.length ? (
                                                            jobSeeker?.profile?.expertise.slice(-5).map((expertise, index) => (
                                                                <Badge key={index} className="border border-gray-400 font-light bg-white-500 text-gray-800 px-4 py-1 hover:bg-black hover:text-white transition duration-200">
                                                                    {expertise}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No expertise listed.</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <style jsx>{`
                                            /* Hide scrollbar */
                                            .col-span-2::-webkit-scrollbar {
                                                display: none;
                                            }

                                            /* Smooth scrolling behavior */
                                            .col-span-2 {
                                                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                                                scrollbar-width: none;  /* Firefox */
                                            }
                                        `}</style>

                                            </div>
                                            <a
                                                href={`/agency/${jobSeeker._id}`}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md hover:text-[#006241] text-[#17B169] bg-green-100 hover:bg-green-200 transition-colors duration-200"
                                            >
                                                View Profile
                                                <ExternalLink className="ml-1 h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <a
                                href="/agencies"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-small rounded-md text-white bg-[#17B169] hover:bg-[#006241] transition-colors duration-200"
                            >
                                Explore All Agencies
                            </a>
                        </div>
                    </div>
                </main>

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