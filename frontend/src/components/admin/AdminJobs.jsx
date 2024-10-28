import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, PlusCircle, Briefcase } from 'lucide-react'
import Navbar from '../shared/Navbar'
import AdminJobsTable from './AdminJobsTable'
import Footer from '../shared/Footer'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Helmet } from 'react-helmet';

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchJobByText(input))
  }, [input, dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Manage Project Listings | Admin Dashboard for Qualtr</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-[1px] rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
                  <Briefcase className="w-6 h-6 mr-3 text-green-600" />
                  Your Projects
                </h1>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  onClick={() => navigate("/admin/projects/create")}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  New Project
                </Button>
              </div>
              <div className="relative mb-6">
                <Input
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Filter by name, title"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <AdminJobsTable />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminJobs