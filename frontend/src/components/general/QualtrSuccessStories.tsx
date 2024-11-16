import React, { useState } from 'react';
import { Star, ArrowRight, Quote } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Helmet } from 'react-helmet';

const QualtrSuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);


  const successStories = [
    {
      brand: "Deeptrue",
      agency: "MarketMinds",
      title: "Quick Insights for Launching New Product Lines",
      description: "Deeptrue collaborated with MarketMinds to quickly gather and analyze consumer insights, helping launch three new product lines effectively.",
      fullStory: "Deeptrue sought to improve its market reach for new product lines. With the help of MarketMinds, they accessed comprehensive, ready-to-use surveys that yielded critical insights on consumer preferences. This collaboration helped Deeptrue tailor their offerings more precisely, reducing time-to-market and improving product-market fit across multiple industries.",
      
      quote: "MarketMinds enabled us to gain actionable insights faster than we thought possible. Qualtr made connecting with the right team easy and impactful.",
      author: "Head of Product Research at Deeptrue"
    },
    {
      brand: "Dawdle",
      agency: "SolutionSphere",
      title: "Streamlined Solutions for Business Expansion",
      description: "Dawdle partnered with SolutionSphere to address complex business challenges, resulting in a streamlined solution roadmap and a 20% improvement in cost efficiency.",
      fullStory: "Dawdle, aiming to expand into new markets, worked closely with SolutionSphere to map out critical business challenges. SolutionSphere’s tailored approach led to a set of agile, cost-effective solutions, enabling Dawdle to scale operations while reducing unnecessary overhead.",
           quote: "With Qualtr’s help, we found the right match. SolutionSphere brought clarity and efficiency to our roadmap, letting us grow sustainably.",
      author: "Operations Manager at Dawdle"
    },
    {
      brand: "DevFactory",
      agency: "TechOptimize",
      title: "Enhanced Developer Productivity and Code Quality",
      description: "DevFactory’s collaboration with TechOptimize improved developer productivity by 15% and streamlined code quality management.",
      fullStory: "DevFactory needed to optimize its software development processes. By partnering with TechOptimize, they integrated advanced AI-driven tools like CodeFix and B-Hive, enabling better project management and automated code quality checks. This led to an improvement in developer efficiency and project delivery timelines.",
        quote: "Qualtr helped us connect with TechOptimize, whose expertise helped us address our technical debt and streamline productivity.",
      author: "CTO of DevFactory"
    }
  ];
  

  const openModal = (story) => {
    setSelectedStory(story);
  };

  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <Helmet>
        <title>Success Stories | Qualtr Connections That Made a Difference</title>
        <meta name="description" content="Discover inspiring success stories of brands and agencies connected through Qualtr. See how our platform fosters impactful partnerships and drives business growth." />
  <meta name="keywords" content="success stories, brand-agency partnerships, impactful collaborations, marketing success stories, Qualtr achievements, business growth through partnerships" />
      </Helmet>
      <Navbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Transforming Brands Through Perfect Matches</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how Qualtr's innovative platform has connected brands with their ideal digital marketing agencies, leading to extraordinary success stories.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <Star className="text-yellow-400 w-6 h-6 mr-2" />
              <span className="text-2xl font-bold">500+</span>
              <span className="ml-2 text-gray-600">Successful Matches</span>
            </div>
            <div className="flex items-center">
              <Star className="text-yellow-400 w-6 h-6 mr-2" />
              <span className="text-2xl font-bold">98%</span>
              <span className="ml-2 text-gray-600">Client Satisfaction</span>
            </div>
          </div>
        </section>

         {/* Featured Success Stories */}
         <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Success Stories</h3>
          {successStories.map((story, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center mb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                
              </div>
              <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{story.title}</h4>
                <p className="text-gray-600 mb-4">{story.description}</p>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <Quote className="text-gray-400 w-8 h-8 mb-2" />
                  <p className="text-gray-800 italic mb-2">{story.quote}</p>
                  <p className="text-gray-600 text-sm">- {story.author}</p>
                </div>
                <div 
                  onClick={() => openModal(story)} 
                  className="flex items-center text-[#17B169] hover:text-[#16A564] transition-colors duration-300 cursor-pointer"
                >
                  <span className="font-semibold">Read Full Story</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Modal for full story */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{selectedStory.title}</h3>
              <p className="text-gray-800 mb-6">{selectedStory.fullStory}</p>
              <button 
                onClick={closeModal} 
                className="bg-[#17B169] text-white px-4 py-2 rounded hover:bg-[#16A564] transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Success Metrics */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Impact in Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: "100+", description: "Agencies Joined" },
              { metric: "200+", description: "Brands Joined" },
              { metric: "50+", description: "Successful Campaigns" },
              { metric: "98%", description: "Client Retention Rate" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-[#17B169] mb-2">{item.metric}</p>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Clients Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: "Qualtr revolutionized how we approach digital marketing partnerships.", author: "Alex Johnson, CEO of TechInnovate" },
              { quote: "The quality of agencies on Qualtr is unmatched. We found our perfect match!", author: "Lisa Chen, CMO of GreenEats" },
              { quote: "Qualtr saved us time and resources in finding the right agency for our needs.", author: "David Smith, Founder of FitLife" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <Quote className="text-gray-400 w-8 h-8 mb-4" />
                <p className="text-gray-800 italic mb-4">{testimonial.quote}</p>
                <p className="text-gray-600 text-sm">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#17B169] text-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-xl mb-8">Join Qualtr today and connect with the perfect digital marketing agency for your brand.</p>
          <button className="bg-white text-[#17B169] px-8 py-3 rounded-[12px] font-bold hover:bg-green-100 transition-colors duration-300">
            Get Started Now
          </button>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default QualtrSuccessStories;