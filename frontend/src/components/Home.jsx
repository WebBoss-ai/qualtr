import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TopJobSeekers from './TopJobSeekers';

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]); // Added dependencies to useEffect

  return (
    <div>
      <style>
        {`
          ::-webkit-scrollbar {
            display: none; /* Hides the scrollbar */
          }
        `}
      </style>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <TopJobSeekers/>
      <Footer />
    </div>
  );
};

export default Home;
