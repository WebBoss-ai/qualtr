import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, PlusCircle, Search } from 'lucide-react'
import { Helmet } from 'react-helmet';

const Companies = () => {
    useGetAllCompanies()
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setSearchCompanyByText(input))
    }, [input, dispatch])

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
           <Helmet>
  <title>Company Directory | Leading Brands on Qualtr</title>
  <meta name="description" content="Explore the directory of leading brands on Qualtr. Connect with established companies and discover partnership opportunities." />
  <meta name="keywords" content="company directory, leading brands, brand connections, established companies, partnership opportunities, Qualtr brands" />
</Helmet>

            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white border border-[1px] rounded-lg overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                                <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
                                    <Building2 className="w-6 h-6 mr-3 text-green-600" />
                                    Companies
                                </h1>
                                <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                    onClick={() => navigate("/admin/companies/create")}
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    New Company
                                </Button>
                            </div>
                            <div className="relative mb-6">
                                <Input
                                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Filter by company name"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <CompaniesTable />
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default Companies