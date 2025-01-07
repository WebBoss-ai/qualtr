import React, { useState } from 'react';
import axios from 'axios';

const ExperiencesModal = ({ isOpen, onClose, initialExperiences }) => {
    const [experiences, setExperiences] = useState(initialExperiences || []);

    const handleAddExperience = () => {
        setExperiences([
            ...experiences,
            {
                title: '',
                employmentType: '',
                company: '',
                isCurrent: false,
                startDate: { month: '', year: '' },
                endDate: { month: '', year: '' },
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
            await axios.post('/api/marketer/experiences', { experiences });
            alert('Experiences updated successfully');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update experiences');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Edit Experiences</h2>
                {experiences.map((exp, idx) => (
                    <div key={idx} className="experience-form">
                        <input
                            type="text"
                            placeholder="Title"
                            value={exp.title}
                            onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Employment Type"
                            value={exp.employmentType}
                            onChange={(e) => handleChange(idx, 'employmentType', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => handleChange(idx, 'company', e.target.value)}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={exp.isCurrent}
                                onChange={(e) => handleChange(idx, 'isCurrent', e.target.checked)}
                            />
                            I am currently working in this role
                        </label>
                        {/* Date fields */}
                        <input
                            type="text"
                            placeholder="Start Month"
                            value={exp.startDate.month}
                            onChange={(e) => handleChange(idx, 'startDate', { ...exp.startDate, month: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Start Year"
                            value={exp.startDate.year}
                            onChange={(e) => handleChange(idx, 'startDate', { ...exp.startDate, year: e.target.value })}
                        />
                        {!exp.isCurrent && (
                            <>
                                <input
                                    type="text"
                                    placeholder="End Month"
                                    value={exp.endDate.month}
                                    onChange={(e) => handleChange(idx, 'endDate', { ...exp.endDate, month: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="End Year"
                                    value={exp.endDate.year}
                                    onChange={(e) => handleChange(idx, 'endDate', { ...exp.endDate, year: e.target.value })}
                                />
                            </>
                        )}
                        <input
                            type="text"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => handleChange(idx, 'location', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Location Type"
                            value={exp.locationType}
                            onChange={(e) => handleChange(idx, 'locationType', e.target.value)}
                        />
                        <textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleChange(idx, 'description', e.target.value)}
                        />
                    </div>
                ))}
                <button onClick={handleAddExperience}>Add Experience</button>
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ExperiencesModal;
