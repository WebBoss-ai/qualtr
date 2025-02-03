import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { VC_API_END_POINT } from "@/utils/constant"
import { Upload, X } from 'lucide-react'

const VCForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fundName: '',
    fundType: '',
    fundWebsite: '',
    minChequeSize: '',
    maxChequeSize: '',
    stageOfInvestment: '',
    categoriesOfInterest: '',
    typeOfFinancing: '',
    linkedInPage: '',
    thesis: '',
    logo: ''
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get(`${VC_API_END_POINT}/${id}`)
        .then(res => {
          setFormData(res.data.vc)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setError('Failed to load VC data')
          setLoading(false)
        })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, logo: URL.createObjectURL(file) }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key !== 'logo') {
        formDataToSend.append(key, formData[key])
      }
    })

    if (selectedFile) {
      formDataToSend.append("logo", selectedFile)
    }

    try {
      const url = id ? `${VC_API_END_POINT}/${id}` : VC_API_END_POINT
      const method = id ? axios.put : axios.post

      await method(url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      navigate('/vcs')
    } catch (err) {
      console.error(err)
      setError('Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">{id ? 'Edit' : 'Add'} VC Profile</h2>
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fundName" className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
              <input
                type="text"
                id="fundName"
                name="fundName"
                value={formData.fundName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="fundType" className="block text-sm font-medium text-gray-700 mb-1">Fund Type</label>
              <input
                type="text"
                id="fundType"
                name="fundType"
                value={formData.fundType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="fundWebsite" className="block text-sm font-medium text-gray-700 mb-1">Fund Website</label>
              <input
                type="url"
                id="fundWebsite"
                name="fundWebsite"
                value={formData.fundWebsite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="linkedInPage" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Page</label>
              <input
                type="url"
                id="linkedInPage"
                name="linkedInPage"
                value={formData.linkedInPage}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="minChequeSize" className="block text-sm font-medium text-gray-700 mb-1">Min Cheque Size ($)</label>
              <input
                type="number"
                id="minChequeSize"
                name="minChequeSize"
                value={formData.minChequeSize}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="maxChequeSize" className="block text-sm font-medium text-gray-700 mb-1">Max Cheque Size ($)</label>
              <input
                type="number"
                id="maxChequeSize"
                name="maxChequeSize"
                value={formData.maxChequeSize}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="stageOfInvestment" className="block text-sm font-medium text-gray-700 mb-1">Stage of Investment</label>
            <input
              type="text"
              id="stageOfInvestment"
              name="stageOfInvestment"
              value={formData.stageOfInvestment}
              onChange={handleChange}
              required
              placeholder="e.g. Seed, Series A, Series B (comma-separated)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="categoriesOfInterest" className="block text-sm font-medium text-gray-700 mb-1">Categories of Interest</label>
            <input
              type="text"
              id="categoriesOfInterest"
              name="categoriesOfInterest"
              value={formData.categoriesOfInterest}
              onChange={handleChange}
              required
              placeholder="e.g. Fintech, SaaS, AI (comma-separated)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="typeOfFinancing" className="block text-sm font-medium text-gray-700 mb-1">Type of Financing</label>
            <input
              type="text"
              id="typeOfFinancing"
              name="typeOfFinancing"
              value={formData.typeOfFinancing}
              onChange={handleChange}
              required
              placeholder="e.g. Equity, Debt, Convertible Note (comma-separated)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="thesis" className="block text-sm font-medium text-gray-700 mb-1">Thesis</label>
            <textarea
              id="thesis"
              name="thesis"
              value={formData.thesis}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center space-x-4">
              {formData.logo && (
                <div className="relative">
                  <img src={formData.logo || "/placeholder.svg"} alt="VC Logo" className="w-20 h-20 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                <span>Upload Logo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              {loading ? 'Submitting...' : (id ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VCForm