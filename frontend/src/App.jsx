import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import JobSeekersList from './components/JobSeekersList';
import JobSeekerProfile from './components/JobSeekerProfile';
import UpdateProfilePage from './components/UpdateProfilePage';
import AddPortfolio from './components/AddPortfolio'
import BrandDashboard from './components/dashboard/BrandDashboard'
import Home2 from './components/Home2'
import './styles.css';
import SavedJobs from './components/SavedJobs'
import HowToHire from './components/ExtraPages/HowToHire'
import MyMessages from './components/MyMessages'
import AllMessages from './components/AllMessages'
import MessageModal from './components/MessageModal'
import HelpAndSupport from './components/general/HelpAndSupport'
import AboutUs from './components/general/AboutUs'
import QualtrCareers from './components/general/QualtrCarrers'
import OurImpact from './components/general/OurImpact'
import QualtrSuccessStories from './components/general/QualtrSuccessStories'
import HowToFindWork from './components/general/HowToFindWork'
import ContactUs from './components/general/ContactUs'
import AdminDashboard from './components/AdminDashboard'
import AdminMessages from './components/AdminMessages'
import AdminUsers from './components/AdminUsers'
import CompareList from './components/CompareList'
import Layout from './components/Layout'
import EmailSent from './components/auth/EmailSent'
import VerifyEmail from './components/auth/VerifyEmail'
import PrivacyPolicy from './components/general/PrivacyPolicy'
import Register from './components/marketers/Register'
import MarketerLogin from './components/marketers/Login'
import ProfileList from './components/marketers/ProfileList'
import ProfileDetails from './components/marketers/ProfileDetails'
import MarketerUpdateProfile from './components/marketers/MarketerUpdateProfile'
import ExperiencesPage from './components/marketers/ExperiencesPage'
import CampaignManagement from './components/marketers/CampaignManagement'
import PostsPage from './components/marketers/post/PostsPage'
import AdminProfiles from './components/marketers/admin/AdminProfiles'
import AdminToggle from './components/marketers/post/AdminToggle'
import PostDetails from './components/marketers/post/PostDetails '
import RichTextEditor from './components/RichTextEditor'
import UserAllPosts from './components/marketers/post/UserAllPosts'
import InspirationsPosts from './components/marketers/post/CategoryPosts/InspirationsPosts'
import FinanceInvestmentPosts from './components/marketers/post/CategoryPosts/FinanceInvestmentPosts'
import LegalCompliancePosts from './components/marketers/post/CategoryPosts/LegalCompliancePosts'
import SalesCustomerAcquisitionPosts from './components/marketers/post/CategoryPosts/SalesCustomerAcquisitionPosts'
import TechnologyToolsPosts from './components/marketers/post/CategoryPosts/TechnologyToolsPosts'
import StartupEssentialsPosts from './components/marketers/post/CategoryPosts/StartupEssentialsPosts'
import MarketingBrandingPosts from './components/marketers/post/CategoryPosts/MarketingBrandingPosts'
import TrendingPostsSection from './components/marketers/post/CategoryPosts/TrendingPostsSection'
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home2 />
  },
  {
    path: '/home',
    element: <Home2 />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/open-projects",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <Layout><ProtectedRoute><Companies/></ProtectedRoute></Layout>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/projects",
    element:<Layout><ProtectedRoute><AdminJobs/></ProtectedRoute></Layout>
  },
  {
    path:"/admin/projects/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/projects/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path:"/agencies",
    element:<Layout><JobSeekersList /></Layout>
  },{
    path:"/agency/:id",
    element:<JobSeekerProfile /> 
  },
  {
    path:"/profile/update",
    element:<UpdateProfilePage /> 
  },
  {
    path:"/dashboard/brand",
    element:<BrandDashboard /> 
  },
  {
    path:"/projects/saved",
    element:<SavedJobs /> 
  },
  {
    path:"/portfolio",
    element:<AddPortfolio /> 
  },
  {
    path:"/email-sent",
    element:<EmailSent /> 
  },
  {
    path:"/verify-email",
    element:<VerifyEmail /> 
  },
  {
    path:"/how-to-hire",
    element:<HowToHire /> 
  },
  {
    path:"/my-meetings",
    element: <Layout><MyMessages /></Layout>  
  },
  {
    path:"/admin/PEbYAjJgctVkocEdaCWF9LCJs731rtQ5lV4VynE4VIQX4dApNioVoyrAjteflZdDv3hxcI9YGY9LLrR3mYq0uc7xN56FwNoZze0j",
    element:<AdminMessages /> 
  },
  {
    path:"/admin/users/PEbYAjJgctVkocEdaCWF9LCJs731rtQ5lV4VynE4VIQX4dApNioVoyrAjteflZdDv3hxcI9YGY9LLrR3mYq0uc7xN56FwNoZze0j",
    element:<AdminUsers /> 
  },
  {
    path:"/compare-list",
    element:<CompareList /> 
  },
  {
    path:"/support",
    element:<HelpAndSupport /> 
  },
  {
    path:"/about",
    element:<AboutUs /> 
  },
  {
    path:"/contact",
    element:<ContactUs /> 
  },
  {
    path:"/carrers",
    element:<QualtrCareers /> 
  },
  {
    path:"/impact",
    element:<OurImpact /> 
  },
  {
    path:"/success-stories",
    element:<QualtrSuccessStories /> 
  },
  {
    path:"/how-to-find-work",
    element:<HowToFindWork /> 
  },
  {
    path:"/privacy-policy",
    element:<PrivacyPolicy /> 
  },
  {
    path:"/founder/register",
    element:<Register /> 
  },
  {
    path:"/founder/login",
    element:<MarketerLogin /> 
  },
  {
    path:"/founder-profile/update",
    element:<MarketerUpdateProfile /> 
  },
  {
    path:"/founder/profiles",
    element:<ProfileList /> 
  },
  {
    path:"/founder/experience",
    element:<ExperiencesPage /> 
  },
  {
    path:"/founder/campaigns",
    element:<CampaignManagement /> 
  },
  {
    path:"/founder-profile/:id",
    element:<ProfileDetails /> 
  },
  {
    path:"/posts",
    element:<PostsPage /> 
  },
  {
    path:"/trending",
    element:<TrendingPostsSection /> 
  },
  {
    path:"/posts/inspirations",
    element:<InspirationsPosts /> 
  },
  {
    path:"/posts/finance-investment",
    element:<FinanceInvestmentPosts /> 
  },
  {
    path:"/posts/legal-compliance",
    element:<LegalCompliancePosts /> 
  },
  {
    path:"/posts/sales-customer-acquisition",
    element:<SalesCustomerAcquisitionPosts /> 
  },
  {
    path:"/posts/technology-tools",
    element:<TechnologyToolsPosts /> 
  },
  {
    path:"/posts/startup-essentials",
    element:<StartupEssentialsPosts /> 
  },
  {
    path:"/posts/marketing-branding",
    element:<MarketingBrandingPosts /> 
  },
  {
    path:"/text-editor",
    element:<RichTextEditor /> 
  },
  {
    path:"/post/:id",
    element:<PostDetails /> 
  },
  {
    path:"/all-posts/:authorId",
    element:<UserAllPosts /> 
  },
  {
    path:"/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4NTU2MzU4ZTZmMmI3YTVjOTM0ZGYiLCJpYXQiOjE3MzAxMTMzNzYsImV4cCI6MTczMjcwNTM3Nn0.n4DUTrEBP_InFG8UlQNuWLsl4xhlIopufmi0o5J5ZLQ",
    element:<AdminDashboard /> 
  },
  {
    path:"/admin/founder-profiles/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4NTU2MzU4ZTZmMmI3YTVjOTM0ZGYiLCJpYXQiOjE3MzAxMTMzNzYsImV4cCI6MTczMjcwNTM3Nn0.n4DUTrEBP_InFG8UlQNuWLsl4xhlIopufmi0o5J5ZLQ",
    element:<AdminProfiles /> 
  },
  {
    path:"/admin/post-management/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4NTU2MzU4ZTZmMmI3YTVjOTM0ZGYiLCJpYXQiOjE3MzAxMTMzNzYsImV4cCI6MTczMjcwNTM3Nn0.n4DUTrEBP_InFG8UlQNuWLsl4xhlIopufmi0o5J5ZLQ",
    element:<AdminToggle /> 
  },

])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
