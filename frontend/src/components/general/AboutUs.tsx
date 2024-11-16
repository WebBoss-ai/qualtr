import React from 'react';
import { Users, Target, Zap, Award } from 'lucide-react';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  const teamMembers = [
    { name: "Jane Doe", role: "CEO & Founder", image: "https://i.pravatar.cc/300?img=1" },
    { name: "John Smith", role: "CTO", image: "https://i.pravatar.cc/300?img=2" },
    { name: "Alice Johnson", role: "Head of Marketing", image: "https://i.pravatar.cc/300?img=3" },
    { name: "Bob Williams", role: "Lead Developer", image: "https://i.pravatar.cc/300?img=4" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
       <Helmet>
  <title>About Qualtr | Our Mission to Connect Brands and Agencies</title>
  <meta name="description" content="Learn more about Qualtr, our mission, and how we connect brands with the best marketing agencies for successful partnerships." />
  <meta name="keywords" content="about Qualtr, brand-agency connection, marketing partnerships, platform mission, successful collaborations" />
</Helmet>

      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Introduction Section */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connecting Brands with Top Digital Marketing Agencies</h2>
            <p className="text-xl text-gray-600">
              We're on a mission to revolutionize how brands find and collaborate with digital marketing agencies. 
              Our platform streamlines the process, ensuring perfect matches and successful partnerships.
            </p>
          </div>
        </section>

        {/* New Paragraph Section */}
        <section className="mb-20">
          <div className="max-w-6xl my-4 mx-auto text-center">
            <p className="text-lg text-gray-700 bg-white py-8 px-6 rounded-md border ">
              At <span className="font-bold text-[#17B169]">Qualtr</span>, we bridge the gap between brands and the best digital marketing agencies. Our platform simplifies the process of finding the perfect agency to meet your unique business needs. Whether you're looking to enhance your brand visibility, drive more leads, or launch an innovative campaign, Qualtr connects you with top-tier marketing experts to ensure your goals are achieved. With a focus on precision, innovation, and collaboration, we’re here to help brands build successful, long-lasting partnerships that drive results.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Collaboration", description: "We believe in the power of teamwork and partnerships." },
              { icon: Target, title: "Precision", description: "We strive for accuracy in every match we make." },
              { icon: Zap, title: "Innovation", description: "We constantly evolve to stay ahead in the digital landscape." },
              { icon: Award, title: "Excellence", description: "We're committed to delivering the highest quality service." },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border-2 border-[#17B169] text-center transition-all duration-300" style={{ borderWidth: "12px 1px 12px 1px" }}>
                <value.icon className="mx-auto text-[#17B169] mb-4" size={32} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer/>
    </div>
  );
};

export default AboutUs;
