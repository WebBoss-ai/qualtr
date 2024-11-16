import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setAllApplicants } from '@/redux/applicationSlice'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import Footer from '../shared/Footer'
import { Users } from 'lucide-react'
import { Helmet } from 'react-helmet';

const Applicants = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const { applicants } = useSelector(store => store.application)

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true })
                dispatch(setAllApplicants(res.data.job))
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllApplicants()
    }, [dispatch, params.id])

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
           <Helmet>
  <title>View Bids | Manage Agencies for Your Project</title>
  <meta name="description" content="Review and manage agency bids for your projects. Compare proposals and select the perfect marketing expert on Qualtr." />
  <meta name="keywords" content="view bids, manage agencies, project proposals, agency bids, bid management, marketing experts, compare proposals" />
</Helmet>

            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white border border-[1px] rounded-lg overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 flex items-center">
                                    <Users className="w-6 h-6 mr-3 text-[#17B169]" />
                                    Applicants
                                </h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Total: {applicants?.applications?.length || 0}
                                </span>
                            </div>
                            <ApplicantsTable />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Applicants