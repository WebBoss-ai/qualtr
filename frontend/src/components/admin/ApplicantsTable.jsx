import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MoreHorizontal, MapPin, Users, FileText, Calendar, Check, X, Eye } from 'lucide-react'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { BiRupee } from 'react-icons/bi'

const shortlistingStatus = ["Accepted", "Rejected"]

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobSeekers, setJobSeekers] = useState([]);

    const itemsPerPage = 8

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    // Pagination logic
    const totalItems = applicants?.applications?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const paginatedApplicants = applicants?.applications?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <Table>
                <TableCaption className="pb-4 text-gray-500">
                    A list of your recently applied agencies
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Agency</TableHead>
                        <TableHead className="font-semibold text-gray-700">Location</TableHead>
                        <TableHead className="font-semibold text-gray-700">Employees</TableHead>
                        <TableHead className="font-semibold text-gray-700">Proposal</TableHead>
                        <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date Applied</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedApplicants && paginatedApplicants.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={item?.applicant?.profile?.profilePhoto || "/placeholder.svg"} alt={item?.applicant?.profile?.agencyName} />
                                        <AvatarFallback>{item?.applicant?.profile?.agencyName}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{item?.applicant?.profile?.agencyName}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center text-gray-500">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {item?.applicant?.profile?.location}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center text-gray-500">
                                    <Users className="w-4 h-4 mr-2" />
                                    {item?.applicant?.profile?.numberOfEmployees}
                                </div>
                            </TableCell>
                            <TableCell>
                                {item?.proposalUrl ? (
                                    <a
                                        href={item.proposalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Proposal
                                    </a>
                                ) : (
                                    <Badge variant="outline" className="text-gray-500">
                                        No Proposal
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center text-gray-500">
                                    <BiRupee className="w-4 h-4" />
                                    {item?.budget}
                                </div>
                            </TableCell>


                            <TableCell>
                                <div className="flex items-center text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(item?.applicant.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
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
                                            onClick={() => window.open(`http://localhost:5173/agency/${item?._id}`, '_blank')}
                                        >
                                            <Eye className="w-4 h-4 mr-2 text-green-500" />
                                            View Profile
                                        </Button>
                                        {shortlistingStatus.map((status, index) => (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => statusHandler(status, item?._id)}
                                            >
                                                {status === "Accepted" ? (
                                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                                ) : (
                                                    <X className="w-4 h-4 mr-2 text-red-500" />
                                                )}
                                                {status}
                                            </Button>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Component */}
            <div className="flex justify-center py-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#17B169] text-white' : 'bg-gray-100 text-gray-800'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ApplicantsTable
