import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const EducationModal = ({ isOpen, onClose, initialEducation }) => {
    const [education, setEducation] = useState(initialEducation || []);

    const handleAddEducation = () => {
        setEducation([
            ...education,
            {
                school: '',
                degree: '',
                fieldOfStudy: '',
                startDate: null,
                endDate: null,
                grade: '',
                activitiesAndSocieties: '',
                description: '',
            },
        ]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    const handleSubmit = async () => {
        try {
            const formattedEducation = education.map(edu => ({
                ...edu,
                startDate: edu.startDate
                    ? {
                          month: edu.startDate.getMonth() + 1,
                          year: edu.startDate.getFullYear(),
                      }
                    : null,
                endDate: edu.endDate
                    ? {
                          month: edu.endDate.getMonth() + 1,
                          year: edu.endDate.getFullYear(),
                      }
                    : null,
            }));

            await axios.post(`${MARKETER_API_END_POINT}/profile/education`, { education: formattedEducation });
            alert('Education updated successfully');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update education');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Education</h2>
                {education.map((edu, idx) => (
                    <div key={idx} className="mb-6 border p-4 rounded-md shadow-sm">
                        <label className="block text-sm font-medium mb-1">
                            School<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Enter the name of your school (e.g., Harvard University)"
                            value={edu.school}
                            onChange={(e) => handleChange(idx, 'school', e.target.value)}
                        />

                        <label className="block text-sm font-medium mb-1">
                            Degree<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Enter your degree (e.g., Bachelor's)"
                            value={edu.degree}
                            onChange={(e) => handleChange(idx, 'degree', e.target.value)}
                        />

                        <label className="block text-sm font-medium mb-1">
                            Field of Study<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Enter your field of study (e.g., Computer Science)"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleChange(idx, 'fieldOfStudy', e.target.value)}
                        />

                        <div className="flex gap-4 mb-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Start Date<span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    selected={edu.startDate}
                                    onChange={(date) => handleChange(idx, 'startDate', date)}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    className="p-2 border rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <DatePicker
                                    selected={edu.endDate}
                                    onChange={(date) => handleChange(idx, 'endDate', date)}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    className="p-2 border rounded w-full"
                                />
                            </div>
                        </div>

                        <label className="block text-sm font-medium mb-1">Grade</label>
                        <input
                            type="text"
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Enter your grade (e.g., 3.8 GPA)"
                            value={edu.grade}
                            onChange={(e) => handleChange(idx, 'grade', e.target.value)}
                        />

                        <label className="block text-sm font-medium mb-1">Activities and Societies</label>
                        <textarea
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="List any activities or societies you participated in"
                            value={edu.activitiesAndSocieties}
                            onChange={(e) => handleChange(idx, 'activitiesAndSocieties', e.target.value)}
                        />

                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Provide a brief description of your education"
                            value={edu.description}
                            onChange={(e) => handleChange(idx, 'description', e.target.value)}
                        />
                    </div>
                ))}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleAddEducation}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {education.length > 0 ? 'Add Another Education' : 'Add Education'}
                    </button>
                    <div className="space-x-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationModal;
