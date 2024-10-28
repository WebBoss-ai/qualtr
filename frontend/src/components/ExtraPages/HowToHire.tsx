import React from 'react'

import img1 from '../../images/img1_hth.jpg'
import img4 from '../../images/img4_hth.jpg'
import img5 from '../../images/img5_hth.jpg'
import img2 from '../../images/img2_hth.png'
import img3 from '../../images/img3_hth.png'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Helmet } from 'react-helmet';

export default function HowToHire() {
    return (
        <div>
             <Helmet>
        <title>How to Hire | Guide for Brands on Qualtr</title>
      </Helmet>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
                <header className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold text-green-500 mb-4">Find the Perfect Digital Marketing Partner</h1>
                        <p className="text-gray-600 mb-4">Whether you're launching a campaign or scaling your brand, we make hiring an agency seamless and effective.</p>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold">Get Started</button>
                    </div>
                    <img src={img1} alt="Team collaborating on project" className="rounded-lg w-full md:w-1/2 object-cover p-8 border-radius-lg" />
                </header>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">How it Works</h2>
                    <p className="text-gray-600">Our platform is designed to help you find the right agency in a few simple steps. From short-term campaigns to long-term partnerships, you're in control of the hiring process.</p>
                </section>

                <section className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <img src={img4} alt="Person at work" className="w-full rounded-lg mb-6 p-8 md:mb-0 md:mr-6" style={{ height: '404px' }} />
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Step 1: Define Your Needs</h2>
                        <p className="text-gray-600 mb-4">Tell us about your project—whether it’s a social media campaign, SEO, or content creation. We'll match you with agencies specializing in those services.</p>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold">Post Your Project</button>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Step 2: Browse and Compare Agencies</h2>
                    <p className="text-gray-600 mb-6">Explore detailed profiles and portfolios of top digital marketing agencies. Compare their experience, ratings, and past projects to find the perfect fit.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-4 shadow">
                            <img src={img3} alt="Agency 1" className="w-full h-24 rounded-lg mb-6 md:mb-0 md:mr-6" style={{ height: '254px' }} />
                            <p className="font-semibold">Social Media Experts</p>
                            <p className="text-gray-600">Starting from $1,000/month</p>
                        </div>
                        <div className="border rounded-lg p-4 shadow">
                            <img src={img2} alt="Agency 2" className="w-full h-24  rounded-lg mb-6 md:mb-0 md:mr-6" style={{ height: '254px' }} />
                            <p className="font-semibold">SEO & Content Marketing</p>
                            <p className="text-gray-600">Starting from $1,500/month</p>
                        </div>

                    </div>
                </section>

                <section className="mb-12 mt-12">
                    <h2 className="text-2xl font-bold mb-4">Why Trust Us?</h2>
                    <ul className="list-disc pl-5 text-gray-600">
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>Vetted Agencies: Every agency is thoroughly reviewed and rated by previous clients.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>Transparent Process: Clear pricing, contract terms, and performance metrics ensure trust.</span>
                        </li>
                        <li className="flex items-start mb-4">
                            <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>Ongoing Support: We provide 24/7 support and are here to assist at every step of the process.</span>
                        </li>
                    </ul>
                </section>

                <footer className="flex flex-wrap justify-center items-center gap-8 mb-12">
                    <img src="/placeholder.svg?height=50&width=100" alt="Microsoft logo" />
                    <img src="/placeholder.svg?height=50&width=100" alt="Airbnb logo" />
                    <img src="/placeholder.svg?height=50&width=100" alt="Spotify logo" />
                    <img src="/placeholder.svg?height=50&width=100" alt="Nike logo" />
                    <img src="/placeholder.svg?height=50&width=100" alt="HubSpot logo" />
                </footer>

                <section className="flex flex-col md:flex-row items-center">
                    <img src={img5} alt="Secure platform" className="w-full rounded-lg mb-6 p-8 md:mb-0 md:mr-6" style={{ height: '404px' }} />
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Your Data, Your Privacy</h2>
                        <p className="text-gray-600 mb-4">We prioritize your privacy and data security. Our platform is built with robust encryption and compliance measures to keep your information safe.</p>
                        <p className="text-gray-600">You can confidently focus on your projects while we ensure the security of your business information.</p>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    )
}
