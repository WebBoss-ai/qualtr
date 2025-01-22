import React, { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { MARKETER_API_END_POINT } from "@/utils/constant"
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react'

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"]
const locationTypes = ["On-site", "Remote", "Hybrid"]

const ExperiencesPage = ({ profileData, fetchProfile }) => {
    const [editingExperience, setEditingExperience] = useState(null)
    const [updatedExperience, setUpdatedExperience] = useState({})

    const handleEditExperiences = (experience) => {
        setEditingExperience(experience)
        setUpdatedExperience({ ...experience })
    }
    useEffect(() => {
        if (profileData?.experiences) {
            profileData.experiences.forEach((exp) =>
                console.log("")
            );
        }
    }, [profileData]);


    const handleChange = (e) => {
        const { name, value } = e.target
        setUpdatedExperience((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date, field) => {
        if (date instanceof Date && !isNaN(date)) {
            setUpdatedExperience((prev) => ({
                ...prev,
                [field]: date,
            }));
        } else {
            console.error(`Invalid date value for ${field}:`, date);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/edit-experience`, {
                experienceId: editingExperience._id,
                updatedExperience,
            });

            if (response.data.success) {
                if (typeof fetchProfile === "function") {
                    fetchProfile(); // Ensure this is callable
                } else {
                    console.error("fetchProfile is not a function");
                }
                setEditingExperience(null);
            } else {
                console.error("Error in saving edit:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating experience:", error);
            setEditingExperience(null);
        }
    };


    const handleDeleteExperiences = async (experienceId) => {
        try {
            const response = await axios.delete(`${MARKETER_API_END_POINT}/delete-experience/${experienceId}`)

            if (response.data.success) {
                fetchProfile()
            } else {
                console.error("Error in deleting experience:", response.data.message)
            }
        } catch (error) {
            console.error("Error deleting experience:", error)
        }
    }

    if (!profileData || !profileData.experiences) {
        return <p className="text-gray-600 text-sm">Loading...</p>
    }

    return (
        <div className="bg-white border-t border-l border-r rounded-t-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Experiences</h3>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Experience
                </button>
            </div>
            {profileData.experiences.length > 0 ? (
                <ul className="space-y-6">
                    {profileData.experiences.map((exp, index) => (
                        <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEditExperiences(exp)} className="text-gray-400 hover:text-gray-600">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteExperiences(exp._id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{exp.employmentType} • {exp.locationType}</p>
                            <p className="text-xs text-gray-500 mb-2">
                                {exp.startDate
                                    ? `${new Date(exp.startDate.year, exp.startDate.month - 1).toLocaleString('en-US', { month: 'long' })} ${exp.startDate.year}`
                                    : "N/A"}{" "}
                                -{" "}
                                {exp.isCurrent
                                    ? "Present"
                                    : exp.endDate
                                        ? `${new Date(exp.endDate.year, exp.endDate.month - 1).toLocaleString('en-US', { month: 'long' })} ${exp.endDate.year}`
                                        : "N/A"}
                            </p>

                            {exp.description && <p className="text-sm text-gray-700">{exp.description}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No experiences listed.</p>
            )}

            {editingExperience && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg  border border-gray-200 border[1px] p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Edit Experience</h4>
                            <button onClick={() => setEditingExperience(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={updatedExperience.title || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={updatedExperience.company || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                <select
                                    name="employmentType"
                                    value={updatedExperience.employmentType || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                >
                                    <option value="" disabled>Select an option</option>
                                    {employmentTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={updatedExperience.location || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                                <select
                                    name="locationType"
                                    value={updatedExperience.locationType || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                >
                                    <option value="" disabled>Select an option</option>
                                    {locationTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="month"
                                        name="startDate"
                                        value={updatedExperience.startDate ? `${updatedExperience.startDate.year}-${updatedExperience.startDate.month}` : ""} // Format: YYYY-MM
                                        onChange={(e) => {
                                            const [year, month] = e.target.value.split("-");
                                            setUpdatedExperience((prev) => ({
                                                ...prev,
                                                startDate: { year, month }, // Store as an object with year and month
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="month"
                                        name="endDate"
                                        value={updatedExperience.endDate ? `${updatedExperience.endDate.year}-${updatedExperience.endDate.month}` : ""} // Format: YYYY-MM
                                        onChange={(e) => {
                                            const [year, month] = e.target.value.split("-");
                                            setUpdatedExperience((prev) => ({
                                                ...prev,
                                                endDate: { year, month }, // Store as an object with year and month
                                            }));
                                        }}
                                        disabled={updatedExperience.isCurrent} // Disable if 'isCurrent' is checked
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isCurrent"
                                    name="isCurrent"
                                    checked={updatedExperience.isCurrent || false}
                                    onChange={(e) =>
                                        setUpdatedExperience((prev) => ({
                                            ...prev,
                                            isCurrent: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-700">
                                    Current Position
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={updatedExperience.description || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingExperience(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 border border-transparent rounded-md  border border-gray-200 border[1px] text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExperiencesPage