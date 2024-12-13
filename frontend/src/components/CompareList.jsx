import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const CompareList = () => {
    const [compareList, setCompareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompareList = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${USER_API_END_POINT}/compare`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                setCompareList(response.data.compareList || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching compare list:", err);
                setError("Failed to fetch compare list. Please try again.");
                setLoading(false);
            }
        };

        fetchCompareList();
    }, []);

    if (loading) return <p>Loading compare list...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1 className="heading">Compare List</h1>
            {compareList.length === 0 ? (
                <p>No agencies added to the compare list yet.</p>
            ) : (
                <ul className="compare-list">
                    {compareList.map((agency) => (
                        <li key={agency._id} className="compare-item">
                            <img 
                                src={agency.profilePhoto} 
                                alt={agency.fullname} 
                                className="profile-photo" 
                            />
                            <div className="agency-details">
                                <h3>{agency.fullname}</h3>
                                <p><strong>Email:</strong> {agency.email}</p>
                                {agency.profile && (
                                    <div className="profile-details">
                                        <p><strong>Agency Name:</strong> {agency.profile.agencyName}</p>
                                        <p><strong>Slogan:</strong> {agency.profile.slogan}</p>
                                        <p><strong>Location:</strong> {agency.profile.location}</p>
                                        <p><strong>Number of Employees:</strong> {agency.profile.numberOfEmployees}</p>
                                        <p><strong>Year Founded:</strong> {agency.profile.yearFounded}</p>
                                        <p><strong>Bio:</strong> {agency.profile.bio}</p>
                                        <p><strong>Skills:</strong> {agency.profile.skills?.join(", ") || "N/A"}</p>
                                        <p><strong>Budget Range:</strong> {agency.profile.budgetRange ? `${agency.profile.budgetRange.min} - ${agency.profile.budgetRange.max}` : "N/A"}</p>
                                        <p><strong>Services Offered:</strong> {agency.profile.servicesOffered?.join(", ") || "N/A"}</p>
                                        <p><strong>Expertise:</strong> {agency.profile.expertise?.join(", ") || "N/A"}</p>
                                        <p><strong>Industries:</strong> {agency.profile.industries?.join(", ") || "N/A"}</p>
                                        <div><strong>Portfolio:</strong>
                                            {agency.profile.portfolio?.length > 0 ? (
                                                <ul>
                                                    {agency.profile.portfolio.map((item, index) => (
                                                        <li key={index}>
                                                            <p><strong>Title:</strong> {item.title}</p>
                                                            <p><strong>Challenge:</strong> {item.challenge}</p>
                                                            <p><strong>Solution:</strong> {item.solution}</p>
                                                            <p><strong>Result:</strong> {item.result}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No portfolio available.</p>
                                            )}
                                        </div>
                                        <p><strong>Past Clients:</strong> {agency.profile.pastClients?.join(", ") || "N/A"}</p>
                                        <div><strong>Awards:</strong>
                                            {agency.profile.awards?.length > 0 ? (
                                                <ul>
                                                    {agency.profile.awards.map((award, index) => (
                                                        <li key={index}>
                                                            <p><strong>Award Name:</strong> {award.awardName}</p>
                                                            <p><strong>Year:</strong> {award.year}</p>
                                                            {award.link && (
                                                                <p><strong>Link:</strong> <a href={award.link} target="_blank" rel="noopener noreferrer">View</a></p>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No awards available.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompareList;
