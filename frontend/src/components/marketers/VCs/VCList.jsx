import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { VC_API_END_POINT } from "@/utils/constant"
import { Building2, Globe, LinkedinIcon, DollarSign, Target, Briefcase, Tags, Search, Sliders, Plus, Filter } from 'lucide-react'
import Navbar2 from '@/components/shared/Navbar2'
import Footer2 from '@/components/shared/Footer2'

const VCList = () => {
    const [vcs, setVcs] = useState([])
    const [filteredVcs, setFilteredVcs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [chequeRange, setChequeRange] = useState({ min: 0, max: 100000000 })
    const [selectedStages, setSelectedStages] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const [thesisSearch, setThesisSearch] = useState('')

    const stages = [
        'Ideation',
        'Prototype',
        'Early Revenue',
        'Scaling'
    ]

    const categories = [
        'B2B SaaS',
        'Fintech',
        'E-commerce',
        'Healthcare',
        'Enterprise',
        'Consumer'
    ]

    const types = [
        'Venture Capital',
        'Angel Network',
        'Corporate VC',
        'PE Fund',
        'Accelerator'
    ]

    useEffect(() => {
        axios.get(`${VC_API_END_POINT}/`)
            .then(res => {
                setVcs(res.data.vcs || [])
                setFilteredVcs(res.data.vcs || [])
                setLoading(false)
            })
            .catch(err => {
                setError('Failed to load VC profiles')
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        let filtered = [...vcs]

        // Name search
        if (searchTerm) {
            filtered = filtered.filter(vc =>
                vc.fundName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Thesis search
        if (thesisSearch) {
            filtered = filtered.filter(vc =>
                vc.thesis?.toLowerCase().includes(thesisSearch.toLowerCase())
            )
        }

        // Cheque size filter
        filtered = filtered.filter(vc =>
            vc.minChequeSize >= chequeRange.min &&
            vc.maxChequeSize <= chequeRange.max
        )

        // Stage filter
        if (selectedStages.length > 0) {
            filtered = filtered.filter(vc =>
                selectedStages.some(stage =>
                    new RegExp(`^${stage}\\b`, "i").test(vc.stageOfInvestment)
                )
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(vc =>
                selectedCategories.some(category =>
                    vc.categoriesOfInterest.includes(category)
                )
            )
        }

        // Type filter
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(vc =>
                selectedTypes.includes(vc.fundType)
            )
        }

        setFilteredVcs(filtered)
    }, [searchTerm, chequeRange, selectedStages, selectedCategories, selectedTypes, thesisSearch, vcs])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-sm text-gray-500">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-sm text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div>
            <Navbar2 />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters - 30% */}
                        <div className="lg:w-[30%] space-y-6">
                            {/* Toggle Button for Mobile */}
                            <button
                                className="md:hidden flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md shadow-sm"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span>Filters</span>
                                <Filter className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Filter Section - Hidden on Mobile when collapsed */}
                            <div className={`${isOpen ? "block" : "hidden"} md:block bg-white rounded-lg shadow-sm p-6`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-medium text-gray-900">Filters</h2>
                                    <Filter className="w-4 h-4 text-gray-400 md:hidden" onClick={() => setIsOpen(false)} />
                                </div>

                                {/* Search */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Fund Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                placeholder="Search funds..."
                                            />
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Thesis Search</label>
                                        <input
                                            type="text"
                                            value={thesisSearch}
                                            onChange={(e) => setThesisSearch(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Search in thesis..."
                                        />
                                    </div>
                                </div>

                                {/* Cheque Size Range */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Cheque Size Range ($)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={chequeRange.min}
                                            onChange={(e) => setChequeRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Min"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={chequeRange.max}
                                            onChange={(e) => setChequeRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                {/* Fund Type */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Fund Type</label>
                                    <div className="space-y-2">
                                        {types.map(type => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => {
                                                        setSelectedTypes(prev =>
                                                            prev.includes(type)
                                                                ? prev.filter(t => t !== type)
                                                                : [...prev, type]
                                                        )
                                                    }}
                                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Investment Stage */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Investment Stage</label>
                                    <div className="space-y-2">
                                        {stages.map(stage => (
                                            <label key={stage} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStages.includes(stage)}
                                                    onChange={() => {
                                                        setSelectedStages(prev =>
                                                            prev.includes(stage)
                                                                ? prev.filter(s => s !== stage)
                                                                : [...prev, stage]
                                                        )
                                                    }}
                                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{stage}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Categories</label>
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <label key={category} className="flex items-center opacity-50 cursor-not-allowed">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    disabled
                                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content - 70% */}
                        <div className="lg:w-[70%]">
                            {filteredVcs.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500">No VC profiles match your filters.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredVcs.map(vc => (
                                        <Link
                                            key={vc._id}
                                            to={`/vc/${vc._id}`}
                                            className="block bg-white rounded-lg shadow-sm p-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={vc.logo || "/placeholder.svg"}
                                                    alt={vc.fundName}
                                                    className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                                                    onError={(e) => e.target.src = '/default-logo.png'}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-base font-medium text-gray-900">{vc.fundName}</h3>
                                                            <p className="text-sm text-gray-500">{vc.fundType}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                                            <span className="ml-1 text-sm text-gray-600">
                                                                ${vc.minChequeSize} - ${vc.maxChequeSize}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {vc.categoriesOfInterest[0]
                                                            .split(",")
                                                            .map(category => category.trim())
                                                            .slice(0, 3)
                                                            .map((category, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-3 py-1 rounded-sm text-xs bg-gray-100 text-gray-600"
                                                                >
                                                                    {category}
                                                                </span>
                                                            ))}
                                                        {vc.categoriesOfInterest[0]
                                                            .split(",")
                                                            .map(category => category.trim())
                                                            .length > 3 && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs bg-gray-100 text-gray-600">
                                                                    +{vc.categoriesOfInterest[0]
                                                                        .split(",")
                                                                        .map(category => category.trim()).length - 3}
                                                                </span>
                                                            )}

                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer2 />
        </div>
    )
}

export default VCList