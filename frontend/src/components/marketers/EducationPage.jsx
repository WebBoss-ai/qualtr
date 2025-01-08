import React, { useState } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const EducationPage = ({ profileData, fetchProfileData }) => {
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
                fetchProfileData();
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
                fetchProfileData();
            }
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    if (!profileData || !profileData.education) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h3>Education</h3>
            {profileData.education.length > 0 ? (
                <ul>
                    {profileData.education.map((edu, index) => (
                        <li key={index}>
                            <p>
                                <strong>School:</strong> {edu.school}
                            </p>
                            <p>
                                <strong>Degree:</strong> {edu.degree}
                            </p>
                            <p>
                                <strong>Field of Study:</strong> {edu.fieldOfStudy}
                            </p>
                            <p>
                                <strong>Start Date:</strong> {edu.startDate?.month} {edu.startDate?.year}
                            </p>
                            <p>
                                <strong>End Date:</strong> {edu.endDate?.month} {edu.endDate?.year}
                            </p>
                            {edu.grade && (
                                <p>
                                    <strong>Grade:</strong> {edu.grade}
                                </p>
                            )}
                            {edu.activitiesAndSocieties && (
                                <p>
                                    <strong>Activities & Societies:</strong> {edu.activitiesAndSocieties}
                                </p>
                            )}
                            {edu.description && (
                                <p>
                                    <strong>Description:</strong> {edu.description}
                                </p>
                            )}
                            <button onClick={() => handleEditEducation(edu)}>Edit</button>
                            <button onClick={() => handleDeleteEducation(edu._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No education records listed.</p>
            )}

            {editingEducation && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Education</h4>
                        <label>School</label>
                        <input
                            type="text"
                            name="school"
                            value={updatedEducation.school || ""}
                            onChange={handleChange}
                        />
                        <label>Degree</label>
                        <input
                            type="text"
                            name="degree"
                            value={updatedEducation.degree || ""}
                            onChange={handleChange}
                        />
                        <label>Field of Study</label>
                        <input
                            type="text"
                            name="fieldOfStudy"
                            value={updatedEducation.fieldOfStudy || ""}
                            onChange={handleChange}
                        />
                        <label>Start Date</label>
                        <div>
                            <input
                                type="text"
                                name="startDate.month"
                                placeholder="Month"
                                value={updatedEducation.startDate?.month || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="startDate.year"
                                placeholder="Year"
                                value={updatedEducation.startDate?.year || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <label>End Date</label>
                        <div>
                            <input
                                type="text"
                                name="endDate.month"
                                placeholder="Month"
                                value={updatedEducation.endDate?.month || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="endDate.year"
                                placeholder="Year"
                                value={updatedEducation.endDate?.year || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <label>Grade</label>
                        <input
                            type="text"
                            name="grade"
                            value={updatedEducation.grade || ""}
                            onChange={handleChange}
                        />
                        <label>Activities & Societies</label>
                        <textarea
                            name="activitiesAndSocieties"
                            maxLength="500"
                            value={updatedEducation.activitiesAndSocieties || ""}
                            onChange={handleChange}
                        ></textarea>
                        <label>Description</label>
                        <textarea
                            name="description"
                            maxLength="1000"
                            value={updatedEducation.description || ""}
                            onChange={handleChange}
                        ></textarea>
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingEducation(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationPage;
