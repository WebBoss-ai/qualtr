import React, { useState } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const EducationPage = ({ profileData, fetchProfileData }) => {
    const [editingEducation, setEditingEducation] = useState(null);
    const [updatedEducation, setUpdatedEducation] = useState({});

    console.log("Rendering EducationPage...");
    console.log("profileData:", profileData);

    const handleEditEducation = (education) => {
        console.log("Editing education:", education);
        setEditingEducation(education);
        setUpdatedEducation({ ...education });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed - Name: ${name}, Value: ${value}`);
        setUpdatedEducation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        console.log("Saving edited education:", updatedEducation);
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/edit-education`, {
                educationId: editingEducation._id,
                updatedEducation,
            });

            console.log("Save response:", response.data);

            if (response.data.success) {
                console.log("Edit saved successfully");
                fetchProfileData(); // Fetch updated profile data
                setEditingEducation(null);
            } else {
                console.error("Error in saving edit:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating education:", error);
        }
    };

    const handleDeleteEducation = async (educationId) => {
        console.log("Deleting education with ID:", educationId);
        try {
            const response = await axios.delete(`${MARKETER_API_END_POINT}/delete-education/${educationId}`);
            console.log("Delete response:", response.data);

            if (response.data.success) {
                console.log("Education deleted successfully");
                fetchProfileData(); // Refresh the data
            } else {
                console.error("Error in deleting education:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    if (!profileData || !profileData.education) {
        console.warn("profileData or education is undefined.");
        return <p>Loading...</p>; // Show a loading state if profileData is not available
    }

    return (
        <div>
            <h3>Education</h3>
            <p>Debug: Rendering education list with {profileData.education.length} items</p>
            {profileData.education.length > 0 ? (
                <ul>
                    {profileData.education.map((edu, index) => {
                        console.log(`Rendering education ${index + 1}:`, edu);
                        return (
                            <li key={index}>
                                <p>
                                    <strong>Institution:</strong> {edu.institution}
                                </p>
                                <p>
                                    <strong>Degree:</strong> {edu.degree}
                                </p>
                                <p>
                                    <strong>Field of Study:</strong> {edu.fieldOfStudy}
                                </p>
                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {edu.startDate?.month} {edu.startDate?.year} -{" "}
                                    {edu.isCurrent ? "Present" : `${edu.endDate?.month} ${edu.endDate?.year}`}
                                </p>
                                {edu.description && <p><strong>Description:</strong> {edu.description}</p>}
                                <button onClick={() => handleEditEducation(edu)}>Edit</button>
                                <button onClick={() => handleDeleteEducation(edu._id)}>Delete</button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No education records listed.</p>
            )}

            {editingEducation && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Education</h4>
                        <label>Institution</label>
                        <input
                            type="text"
                            name="institution"
                            value={updatedEducation.institution || ""}
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
                        <label>Is Current</label>
                        <input
                            type="checkbox"
                            name="isCurrent"
                            checked={updatedEducation.isCurrent || false}
                            onChange={(e) =>
                                setUpdatedEducation((prev) => ({
                                    ...prev,
                                    isCurrent: e.target.checked,
                                }))
                            }
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingEducation(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationPage;
