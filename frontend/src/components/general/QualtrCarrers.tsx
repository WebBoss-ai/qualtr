import React, { useState } from 'react';
import { Search, Briefcase, Users, Zap, Globe, ChevronDown, ChevronRight } from 'lucide-react';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';
import { Helmet } from 'react-helmet';

const QualtrCareers = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jobOpenings = [
    { title: "Full Stack Developer", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Digital Marketing Specialist", department: "Marketing", location: "Remote", type: "Full-time" },
    { title: "Strategy & Sales", department: "Sales", location: "Remote", type: "Full-time" },
  ];

  const benefits = [
    { icon: Globe, title: "Remote-First Culture", description: "Work from anywhere in the world" },
    { icon: Users, title: "Collaborative Environment", description: "Join a team of passionate professionals" },
    { icon: Zap, title: "Continuous Learning", description: "Access to courses and conferences" },
    { icon: Briefcase, title: "Competitive Compensation", description: "Salary, equity, and performance bonuses" },
  ];

  const values = [
    { title: "Innovation", description: "We're always looking for new ways to improve our platform and services." },
    { title: "Integrity", description: "We believe in transparency and honesty in all our dealings." },
    { title: "Collaboration", description: "We work together to achieve common goals and celebrate shared successes." },
    { title: "Excellence", description: "We strive for the highest quality in everything we do." },
  ];

  const faqItems = [
    {
      question: "What is the hiring process like at Qualtr?",
      answer: "Our hiring process typically involves an initial screening call, a technical or skills assessment, and a series of interviews with team members and leadership. We aim to make the process as transparent and efficient as possible."
    },
    {
      question: "Do you offer internship opportunities?",
      answer: "Yes, we offer internship programs in various departments throughout the year. These are great opportunities for students and recent graduates to gain hands-on experience in the digital marketing industry."
    },
    {
      question: "What growth opportunities are available at Qualtr?",
      answer: "We believe in nurturing talent and promoting from within. We offer mentorship programs, leadership training, and opportunities for cross-functional projects to help our employees grow and advance their careers."
    },
    {
      question: "How does Qualtr support diversity and inclusion?",
      answer: "Diversity and inclusion are core values at Qualtr. We have initiatives to promote a diverse workforce, including partnerships with organizations that support underrepresented groups in tech. We also provide regular training on unconscious bias and inclusive practices."
    },
  ];
  const openJobModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Helmet>
        <title>Careers at Qualtr | Join Our Team</title>
      </Helmet>
     
      <Navbar/>
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 my-1 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Careers at Qualtr</h1>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16 mt-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission to Transform Digital Marketing</h2>
            <p className="text-xl text-gray-600 mb-8">
              At Qualtr, we're revolutionizing how brands connect with digital marketing agencies.
              Join our team and be part of shaping the future of marketing collaborations.
            </p>
            <a href="#openings" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white" style={{ backgroundColor: '#17B169' }}>
              View Open Positions
              <ChevronRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="mb-16 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Join Qualtr?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <benefit.icon className="h-8 w-8" style={{ color: '#17B169' }} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>


<section id="openings" className="mb-16 mt-12">
<h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Positions</h2>
<div className="bg-white shadow-sm rounded-lg overflow-hidden">
  <ul className="divide-y divide-gray-200">
    {jobOpenings.map((job, index) => (
      <li key={index}>
        <a href="#" className="block hover:bg-gray-50" onClick={() => openJobModal(job)}>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-600 truncate">{job.title}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {job.type}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  <Briefcase className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                  {job.department}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <Globe className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                  {job.location}
                </p>
              </div>
            </div>
          </div>
        </a>
      </li>
    ))}
  </ul>
</div>
</section>

{/* Modal Section */}
{isModalOpen && selectedJob && (
<div className="fixed z-10 inset-0 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <Briefcase className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedJob.title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Department: {selectedJob.department}
              </p>
              <p className="text-sm text-gray-500">
                Location: {selectedJob.location}
              </p>
              <p className="text-sm text-gray-500">
                Type: {selectedJob.type}
              </p>
              <p className="mt-4 text-sm text-gray-700">
                If you're interested in applying for this role, please email us at <a href="mailto:hiring@qualtr.com" className="text-green-600 font-medium">hiring@qualtr.com</a> with your resume and cover letter.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
)}

        <section className="mb-16 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full text-left px-4 py-3 focus:outline-none"
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${openAccordion === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>
                {openAccordion === index && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default QualtrCareers;
