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
    element: <ProtectedRoute><Companies/></ProtectedRoute>
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
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
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
    element:<JobSeekersList />
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
    path:"/how-to-hire",
    element:<HowToHire /> 
  },
  {
    path:"/my-meetings",
    element:<MyMessages /> 
  },
  {
    path:"/admin/PEbYAjJgctVkocEdaCWF9LCJs731rtQ5lV4VynE4VIQX4dApNioVoyrAjteflZdDv3hxcI9YGY9LLrR3mYq0uc7xN56FwNoZze0j",
    element:<AdminMessages /> 
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
    path:"/admin/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY4NTU2MzU4ZTZmMmI3YTVjOTM0ZGYiLCJpYXQiOjE3MzAxMTMzNzYsImV4cCI6MTczMjcwNTM3Nn0.n4DUTrEBP_InFG8UlQNuWLsl4xhlIopufmi0o5J5ZLQ",
    element:<AdminDashboard /> 
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
