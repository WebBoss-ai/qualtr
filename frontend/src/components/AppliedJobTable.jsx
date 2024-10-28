import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Calendar, Briefcase, Building2 } from 'lucide-react'

// Pagination component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map((num) => num + 1)

    return (
        <div className="flex justify-center space-x-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
                Previous
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-[#17B169] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
                Next
            </button>
        </div>
    )
}

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const jobsPerPage = 10

    // Calculate total pages
    const totalPages = Math.ceil(allAppliedJobs.length / jobsPerPage)

    // Get current page jobs
    const currentJobs = allAppliedJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'accepted':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="w-full bg-white rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Applied Projects</h2>
            </div>
            <div className="p-6">
                {allAppliedJobs.length <= 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">You haven't placed any bids yet.</p>
                        <p className="text-gray-400 mt-2">Start applying to projects to see them listed here!</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3 bg-gray-50">Date</th>
                                        <th className="px-6 py-3 bg-gray-50">Project Title</th>
                                        <th className="px-6 py-3 bg-gray-50">Company</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentJobs.map((appliedJob) => (
                                        <tr key={appliedJob._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{new Date(appliedJob?.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">{appliedJob.job?.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Building2 className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{appliedJob.job?.company?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appliedJob.status)}`}>
                                                    {appliedJob.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                    </>
                )}
            </div>
        </div>
    )
}

export default AppliedJobTable
