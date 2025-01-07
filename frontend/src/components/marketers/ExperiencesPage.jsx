import React, { useState } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const ExperiencesPage = ({ profileData, fetchProfileData }) => {
    const [editingExperience, setEditingExperience] = useState(null);
    const [updatedExperience, setUpdatedExperience] = useState({});

    console.log("Rendering ExperiencesPage...");
    console.log("profileData:", profileData);

    const handleEditExperiences = (experience) => {
        console.log("Editing experience:", experience);
        setEditingExperience(experience);
        setUpdatedExperience({ ...experience });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed - Name: ${name}, Value: ${value}`);
        setUpdatedExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        console.log("Saving edited experience:", updatedExperience);
        try {
            const response = await axios.put(`${MARKETER_API_END_POINT}/edit-experience`, {
                experienceId: editingExperience._id,
                updatedExperience,
            });

            console.log("Save response:", response.data);

            if (response.data.success) {
                console.log("Edit saved successfully");
                fetchProfileData(); // Fetch updated profile data
                setEditingExperience(null);
            } else {
                console.error("Error in saving edit:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating experience:", error);
        }
    };

    const handleDeleteExperiences = async (experienceId) => {
        console.log("Deleting experience with ID:", experienceId);
        try {
            const response = await axios.delete(`${MARKETER_API_END_POINT}/delete-experience/${experienceId}`);
            console.log("Delete response:", response.data);

            if (response.data.success) {
                console.log("Experience deleted successfully");
                fetchProfileData(); // Refresh the data
            } else {
                console.error("Error in deleting experience:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    if (!profileData || !profileData.experiences) {
        console.warn("profileData or experiences is undefined.");
        return <p>Loading...</p>; // Show a loading state if profileData is not available
    }

    return (
        <div>
            <h3>Experiences</h3>
            <p>Debug: Rendering experience list with {profileData.experiences.length} items</p>
            {profileData.experiences.length > 0 ? (
                <ul>
                    {profileData.experiences.map((exp, index) => {
                        console.log(`Rendering experience ${index + 1}:`, exp);
                        return (
                            <li key={index}>
                                <p>
                                    <strong>Title:</strong> {exp.title}
                                </p>
                                <p>
                                    <strong>Company:</strong> {exp.company}
                                </p>
                                <p>
                                    <strong>Employment Type:</strong> {exp.employmentType}
                                </p>
                                <p>
                                    <strong>Location:</strong> {exp.location} ({exp.locationType})
                                </p>
                                <p>
                                    <strong>Duration:</strong>{" "}
                                    {exp.startDate?.month} {exp.startDate?.year} -{" "}
                                    {exp.isCurrent ? "Present" : `${exp.endDate?.month} ${exp.endDate?.year}`}
                                </p>
                                {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
                                <button onClick={() => handleEditExperiences(exp)}>Edit</button>
                                <button onClick={() => handleDeleteExperiences(exp._id)}>Delete</button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No experiences listed.</p>
            )}

            {editingExperience && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Experience</h4>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={updatedExperience.title || ""}
                            onChange={handleChange}
                        />
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={updatedExperience.company || ""}
                            onChange={handleChange}
                        />
                        <label>Employment Type</label>
                        <input
                            type="text"
                            name="employmentType"
                            value={updatedExperience.employmentType || ""}
                            onChange={handleChange}
                        />
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={updatedExperience.location || ""}
                            onChange={handleChange}
                        />
                        <label>Is Current</label>
                        <input
                            type="checkbox"
                            name="isCurrent"
                            checked={updatedExperience.isCurrent || false}
                            onChange={(e) =>
                                setUpdatedExperience((prev) => ({
                                    ...prev,
                                    isCurrent: e.target.checked,
                                }))
                            }
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingExperience(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperiencesPage;
