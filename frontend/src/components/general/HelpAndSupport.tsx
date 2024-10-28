import React, { useState } from 'react';
import { Search, ChevronDown, Mail, Phone, MessageCircle } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Helmet } from 'react-helmet';

const HelpAndSupport = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does your platform connect brands with agencies?",
      answer: "Our platform uses a sophisticated matching algorithm to connect brands with the most suitable digital marketing agencies based on their specific needs, budget, and project requirements."
    },
    {
      question: "What types of digital marketing agencies are available on your platform?",
      answer: "We have a diverse range of agencies specializing in various areas including SEO, PPC, social media marketing, content marketing, email marketing, and more."
    },
    {
      question: "How do you ensure the quality of agencies on your platform?",
      answer: "We have a rigorous vetting process for all agencies. This includes reviewing their portfolio, client testimonials, and conducting interviews to ensure they meet our high standards."
    },
    {
      question: "What if I'm not satisfied with the agency I've been matched with?",
      answer: "We offer a satisfaction guarantee. If you're not happy with your match, we'll work with you to find a better fit at no additional cost."
    },
    {
      question: "How do I sign up as a brand or an agency?",
      answer: "Signing up is simple. For brands, you can create a profile, submit your project needs, and get matched with agencies. For agencies, you can register, create a detailed portfolio, and start receiving matches."
    },
    {
      question: "Is there any cost associated with using your platform?",
      answer: "For brands, our platform is free to use. Agencies can choose from different subscription plans that offer various benefits and visibility."
    },
    {
      question: "How long does it take to get matched with an agency?",
      answer: "Matching times can vary based on your project scope and requirements. However, most brands receive their first matches within 48 hours."
    },
    {
      question: "Can I browse agencies without submitting a project?",
      answer: "Yes, you can browse agency profiles on our platform to get a feel for their work, expertise, and client reviews before submitting a project."
    },
    {
      question: "Do you provide reviews or feedback for agencies?",
      answer: "Yes, we collect feedback from brands after their projects are completed, which helps maintain transparency and ensures agencies continue to provide high-quality services."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
       <Helmet>
        <title>Help & Support | Assistance with Qualtr Platform</title>
      </Helmet>
      <Navbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-16">
  <div className="max-w-3xl mx-auto">
    <div className="relative">
      <input
        type="text"
        placeholder="Search for help..."
        className="w-full px-4 py-3 pl-14 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" // Changed pl-12 to pl-14
      />
      {/* Adjusted the positioning and centering of the icon */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  </div>
</section>


        <section className="mb-16">
          <h2 className="text-2xl mt-12 font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <button
                  className="w-full px-4 py-4 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`text-gray-500 transition-transform duration-300 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-gray-600 transition-all duration-300 ease-in-out">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
  <h2 className="text-2xl mt-12 font-semibold text-gray-900 mb-6">Contact Us</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="bg-white p-6 rounded-lg border-2 border-[#17B169] transition-all duration-300" style={{ borderWidth: "12px 1px 12px 1px" }}>
      <Mail className="text-[#17B169] mb-4" size={24} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Email Support</h3>
      <p className="text-gray-600 mb-4">Get in touch with our support team via email.</p>
      <a href="mailto:support@qualtr.com" className="text-[#17B169] hover:underline">
        support@qualtr.com
      </a>
    </div>
    <div className="bg-white p-6 rounded-lg border-2 border-[#17B169] transition-all duration-300" style={{ borderWidth: "12px 1px 12px 1px" }}>
      <Phone className="text-[#17B169] mb-4" size={24} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Phone Support</h3>
      <p className="text-gray-600 mb-4">Call us directly for immediate assistance.</p>
      <a href="tel:+91867080111" className="text-[#17B169] hover:underline">
        +91 816-7080-111
      </a>
    </div>
    <div className="bg-white p-6 rounded-lg border-2 border-[#17B169] transition-all duration-300" style={{ borderWidth: "12px 1px 12px 1px" }}>
      <MessageCircle className="text-[#17B169] mb-4" size={24} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Live Chat</h3>
      <p className="text-gray-600 mb-4">Chat with our support team in real-time.</p>
      <button className="bg-[#17B169] text-white px-4 py-2 rounded-lg hover:bg-[#139D58] transition duration-300">
        Start Chat
      </button>
    </div>
  </div>
</section>

      </main>

      <Footer/>
    </div>
  );
};

export default HelpAndSupport;
