import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Edit2, Eye, MoreHorizontal, Briefcase, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState(allAdminJobs)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedJob, setSelectedJob] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const jobsPerPage = 6

    const navigate = useNavigate()

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
        })
        setFilterJobs(filteredJobs)
    }, [allAdminJobs, searchJobByText])

    // Calculate pagination
    const indexOfLastJob = currentPage * jobsPerPage
    const indexOfFirstJob = indexOfLastJob - jobsPerPage
    const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob)
    const totalPages = Math.ceil(filterJobs.length / jobsPerPage)

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handleReadMore = (job) => {
        setSelectedJob(job)
        setShowModal(true)
    }

    const truncateTitle = (title) => {
        if (title.length > 25) {
            return title.substring(0, 25) + '...'
        }
        return title
    }

    return (
        
        <div className="bg-white rounded-lg overflow-hidden">
            <Table className="min-w-full">
                <TableCaption className="pb-4 text-gray-500">
                    A list of your recently posted projects
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 py-3 px-4">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-3 px-4">Title</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-3 px-4">Date Posted</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentJobs.map((job) => (
                        <TableRow key={job._id} className="hover:bg-gray-100 transition-colors duration-150">
                            <TableCell className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={job?.company?.logo || "/placeholder.svg"} alt={job?.company?.name} />
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{job?.company?.name}</p>
                                        <p className="text-sm text-gray-500">{job?.company?.location}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 px-4">
                                <div className="">
                                
                                    <span className="font text-gray-900">
                                        {truncateTitle(job?.title)} 
                                        {job?.title.length > 25 && (
                                            <Button variant="link" size="sm" className="text-[#17B169]" onClick={() => handleReadMore(job)}>
                                                Read more
                                            </Button>
                                        )}
                                    </span>
                                    
                                </div>
                            </TableCell>
                            <TableCell className="py-4 px-4">
                                <div className="flex items-center text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(job?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start" 
                                            onClick={() => navigate(`/admin/companies/${job._id}`)}
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start mt-1" 
                                            onClick={() => navigate(`/admin/projects/${job._id}/applicants`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Applicants
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-4 px-4">
                <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="text-[#006241] bg-[#c2f8cb] border border-gray-300 hover:bg-gray-100 px-3 py-1 rounded"
                >
                    Previous
                </Button>
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            onClick={() => handlePageClick(pageNumber)}
                            className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-[#17B169] text-white' : 'text-[#17B169] bg-[#fff] border border-gray-300 hover:bg-gray-100'}`}
                        >
                            {pageNumber}
                        </Button>
                    ))}
                </div>
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="text-[#006241] bg-[#c2f8cb] border border-gray-300 hover:bg-gray-100 px-3 py-1 rounded"
                >
                    Next
                </Button>
            </div>

            {/* Modal for full job details */}
            {selectedJob && (
    <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-md">
            <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-2xl font-semibold text-gray-800">
                    {selectedJob.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                    {selectedJob.description}
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-700">Category</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {selectedJob.category.map((cat, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-[#17B169] px-3 py-1 rounded-full text-sm"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700">Budget</h3>
                    <p className="text-gray-600">
                    ₹{selectedJob.salary.toLocaleString()}
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700">Timeline</h3>
                    <p className="text-gray-600">{selectedJob.timeline}</p>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700">Requirement Document</h3>
                    {selectedJob.requirement_doc ? (
                        <a
                            href={selectedJob.requirement_doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#17B169] hover:underline"
                        >
                            View Document
                        </a>
                    ) : (
                        <p className="text-gray-500">No document available</p>
                    )}
                </div>
            </div>
        </DialogContent>
    </Dialog>
)}

        </div>
    )
}

export default AdminJobsTable
