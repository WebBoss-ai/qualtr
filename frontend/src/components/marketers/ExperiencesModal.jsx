import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { v4 as uuidv4 } from 'uuid';

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const locationTypes = ["On-site", "Remote", "Hybrid"];

const ExperiencesModal = ({ isOpen, onClose, initialExperiences }) => {
    const [experiences, setExperiences] = useState(initialExperiences || []);

    const handleAddExperience = () => {
        setExperiences([
            ...experiences,
            {
                _id: uuidv4(),
                title: '',
                employmentType: '',
                company: '',
                isCurrent: false,
                startDate: null,
                endDate: null,
                location: '',
                locationType: '',
                description: '',
            },
        ]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...experiences];
        updated[index][field] = value;
        setExperiences(updated);
    };

    const handleSubmit = async () => {
        try {
            const formattedExperiences = experiences.map(exp => ({
                ...exp,
                startDate: exp.startDate
                    ? {
                          month: exp.startDate.getMonth() + 1, // getMonth() returns a 0-based month, so add 1
                          year: exp.startDate.getFullYear(),
                      }
                    : null,
                endDate: exp.endDate
                    ? {
                          month: exp.endDate.getMonth() + 1,
                          year: exp.endDate.getFullYear(),
                      }
                    : null,
            }));
    
            await axios.post(`${MARKETER_API_END_POINT}/profile/experiences`, { experiences: formattedExperiences });
            alert('Experiences updated successfully');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update experiences');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Experiences</h2>
                {experiences.map((exp, idx) => (
                    <div key={idx} className="mb-6 border p-4 rounded-md shadow-sm">
                        <input
                            type="text"
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Title"
                            value={exp.title}
                            onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        />
                        <select
                            className="w-full p-2 mb-2 border rounded"
                            value={exp.employmentType}
                            onChange={(e) => handleChange(idx, 'employmentType', e.target.value)}
                        >
                            <option value="">Select Employment Type</option>
                            {employmentTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => handleChange(idx, 'company', e.target.value)}
                        />
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={exp.isCurrent}
                                onChange={(e) => handleChange(idx, 'isCurrent', e.target.checked)}
                            />
                            I am currently working in this role
                        </label>
                        <div className="flex gap-4 mb-2">
                            <div>
                                <label className="block text-sm mb-1">Start Date</label>
                                <DatePicker
                                    selected={exp.startDate}
                                    onChange={(date) => handleChange(idx, 'startDate', date)}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    className="p-2 border rounded w-full"
                                />
                            </div>
                            {!exp.isCurrent && (
                                <div>
                                    <label className="block text-sm mb-1">End Date</label>
                                    <DatePicker
                                        selected={exp.endDate}
                                        onChange={(date) => handleChange(idx, 'endDate', date)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className="p-2 border rounded w-full"
                                    />
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => handleChange(idx, 'location', e.target.value)}
                        />
                        <select
                            className="w-full p-2 mb-2 border rounded"
                            value={exp.locationType}
                            onChange={(e) => handleChange(idx, 'locationType', e.target.value)}
                        >
                            <option value="">Select Location Type</option>
                            {locationTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleChange(idx, 'description', e.target.value)}
                        />
                    </div>
                ))}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleAddExperience}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {experiences.length > 0 ? 'Add Another Experience' : 'Add Experience'}
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

export default ExperiencesModal;
