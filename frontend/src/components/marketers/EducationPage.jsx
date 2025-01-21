import React, { useState } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react'

const EducationPage = ({ profileData, fetchProfile }) => {
    const [editingEducation, setEditingEducation] = useState(null);
    const [updatedEducation, setUpdatedEducation] = useState({});

    const handleEditEducation = (education) => {
        setEditingEducation(education);
        setUpdatedEducation({ ...education });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested fields like startDate and endDate
        if (name.includes(".")) {
            const [field, subField] = name.split(".");
            setUpdatedEducation((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [subField]: value,
                },
            }));
        } else {
            setUpdatedEducation((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/edit-education`, {
                educationId: editingEducation._id,
                updatedEducation,
            });

            if (response.data.success) {
                fetchProfile();
                setEditingEducation(null);
            }
        } catch (error) {
            console.error("Error updating education:", error);
        }
    };

    const handleDeleteEducation = async (educationId) => {
        try {
            const response = await axios.delete(`${MARKETER_API_END_POINT}/delete-education/${educationId}`);

            if (response.data.success) {
                fetchProfile();
            }
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    if (!profileData || !profileData.education) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white border-t border-l border-r rounded-t-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Educations</h3>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Education
                </button>
            </div>
            {profileData.education.length > 0 ? (
                <ul className="space-y-6">
                    {profileData.education.map((edu, index) => (
                        <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">{edu.school}</h4>
                                    <p className="text-sm text-gray-600">{edu.degree}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditEducation(edu)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEducation(edu._id)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{edu.fieldOfStudy}</p>
                            <p className="text-xs text-gray-500 mb-2">
                                {edu.startDate
                                    ? `${edu.startDate.month} ${edu.startDate.year}`
                                    : "N/A"}{" "}
                                -{" "}
                                {edu.endDate
                                    ? `${edu.endDate.month} ${edu.endDate.year}`
                                    : "N/A"}
                            </p>
                            {edu.grade && <p className="text-sm text-gray-700 mb-1">Grade: {edu.grade}</p>}
                            {edu.activitiesAndSocieties && (
                                <p className="text-sm text-gray-700 mb-1">
                                    Activities & Societies: {edu.activitiesAndSocieties}
                                </p>
                            )}
                            {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No education records listed.</p>
            )}

            {editingEducation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg border border-gray-200 border[1px] p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Edit Education</h4>
                            <button onClick={() => setEditingEducation(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                                <input
                                    type="text"
                                    name="school"
                                    value={updatedEducation.school || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    value={updatedEducation.degree || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    value={updatedEducation.fieldOfStudy || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="month"
                                        name="startDate"
                                        value={updatedEducation.startDate ? `${updatedEducation.startDate.year}-${updatedEducation.startDate.month}` : ""}
                                        onChange={(e) => {
                                            const [year, month] = e.target.value.split("-");
                                            setUpdatedEducation((prev) => ({
                                                ...prev,
                                                startDate: { year, month },
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
                                        value={updatedEducation.endDate ? `${updatedEducation.endDate.year}-${updatedEducation.endDate.month}` : ""}
                                        onChange={(e) => {
                                            const [year, month] = e.target.value.split("-");
                                            setUpdatedEducation((prev) => ({
                                                ...prev,
                                                endDate: { year, month },
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={updatedEducation.grade || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Activities & Societies</label>
                                <textarea
                                    name="activitiesAndSocieties"
                                    maxLength="500"
                                    value={updatedEducation.activitiesAndSocieties || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    maxLength="1000"
                                    value={updatedEducation.description || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingEducation(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationPage;