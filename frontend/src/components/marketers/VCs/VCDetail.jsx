import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { VC_API_END_POINT } from "@/utils/constant"
import { Building2, Globe, LinkedinIcon, DollarSign, Target, Briefcase, Tags, FileText, Edit2 } from 'lucide-react'
import Navbar2 from '@/components/shared/Navbar2'
import Footer2 from '@/components/shared/Footer2'

const VCDetail = () => {
    const { id } = useParams()
    const [vc, setVc] = useState(null)

    useEffect(() => {
        axios.get(`${VC_API_END_POINT}/${id}`)
            .then(res => setVc(res.data.vc))
            .catch(err => console.error(err))
    }, [id])

    if (!vc) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-sm text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div>
            <Navbar2 />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content - 70% */}
                        <div className="lg:w-[70%] space-y-8">
                            {/* Header Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-start gap-6">
                                    <img
                                        src={vc.logo || "/placeholder.svg"}
                                        alt={vc.fundName}
                                        className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                                        onError={(e) => e.target.src = '/default-logo.png'}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h1 className="text-xl font-semibold text-gray-900">{vc.fundName}</h1>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{vc.fundType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Investment Thesis */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Investment Thesis
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{vc.thesis}</p>
                            </div>

                            {/* Investment Categories */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                    <Tags className="w-4 h-4 mr-2" />
                                    Categories of Interest
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {vc.categoriesOfInterest[0]
                                        .split(",")
                                        .map(category => category.trim())
                                        .map((category, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-sm text-xs bg-gray-100 text-gray-600"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                </div>
                            </div>


                            {/* Investment Stages */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                    <Target className="w-4 h-4 mr-2" />
                                    Investment Stages
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vc.stageOfInvestment[0]
                                        .split(",")
                                        .map(stage => stage.trim())
                                        .map((stage, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                <span>{stage}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>


                        </div>

                        {/* Sidebar - 30% */}
                        <div className="lg:w-[30%] space-y-6">
                            {/* Quick Info Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">Quick Information</h2>
                                <div className="space-y-4">
                                    <a
                                        href={vc.fundWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <Globe className="w-4 h-4 mr-3 text-gray-400" />
                                        Visit Website
                                    </a>
                                    <a
                                        href={vc.linkedInPage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <LinkedinIcon className="w-4 h-4 mr-3 text-gray-400" />
                                        LinkedIn Profile
                                    </a>
                                </div>
                            </div>

                            {/* Investment Details Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">Investment Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <DollarSign className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Cheque Size</p>
                                            <p className="text-sm text-gray-900">
                                                ${vc.minChequeSize} - ${vc.maxChequeSize}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Briefcase className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Financing Types</p>
                                            <p className="text-sm text-gray-900">
                                                {vc.typeOfFinancing[0]
                                                    .split(",")
                                                    .map(type => type.trim())
                                                    .map((type, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-3 py-1 rounded-sm text-xs bg-gray-100 text-gray-600 mr-2"
                                                        >
                                                            {type}
                                                        </span>
                                                    ))}
                                            </p>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer2 />
        </div>
    )
}

export default VCDetail