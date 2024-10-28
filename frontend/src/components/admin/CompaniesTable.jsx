import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Edit2, MoreHorizontal, Eye, Building2, MapPin, Globe, Calendar } from 'lucide-react'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const [filterCompany, setFilterCompany] = useState(companies)
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [modalIsOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const filteredCompany = companies.filter((company) => {
            if (!searchCompanyByText) return true
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        })
        setFilterCompany(filteredCompany)
    }, [companies, searchCompanyByText])

    const openModal = (company) => {
        setSelectedCompany(company)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Date Registered</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany?.map((company) => (
                        <TableRow key={company._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-900">{company.name}</p>
                                        <p className="text-sm text-gray-500 md:hidden">{new Date(company.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(company.createdAt).toLocaleDateString()}
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
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start mt-1"
                                            onClick={() => openModal(company)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Profile
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={modalIsOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    {selectedCompany && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                    <Building2 className="w-5 h-5 text-[#17B169]" />
                                    <span>{selectedCompany.name}</span>
                                </DialogTitle>
                                <DialogDescription>Company Profile Details</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Avatar className="h-20 w-20 mx-auto">
                                    <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                                    <AvatarFallback>{selectedCompany.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500">Description</h4>
                                    <p className="text-sm">{selectedCompany.description || 'N/A'}</p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                    <p className="text-sm">{selectedCompany.location || 'N/A'}</p>
                                </div>
                                <div className="flex items-center">
                                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-sm text-green-500 hover:underline">
                                        {selectedCompany.website || 'N/A'}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    <p className="text-sm">Created on {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="bg-[#17B169]" onClick={closeModal}>Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CompaniesTable