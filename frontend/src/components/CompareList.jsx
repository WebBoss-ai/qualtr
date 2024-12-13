import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const CompareList = () => {
    const [compareList, setCompareList] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    // Fetch the compare list
    useEffect(() => {
        const fetchCompareList = async () => {
            try {
                // Get the token from local storage
                const token = localStorage.getItem("token");
                console.log("Token used for fetching compare list:", token);

                // Make the GET request with the token in the Authorization header
                const response = await axios.get(`${USER_API_END_POINT}/compare`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Include credentials if required by the backend
                });

                console.log("API Response:", response.data);

                // Validate and update the compare list state
                setCompareList(response.data.compareList || []); // Fallback to an empty array if undefined
                setLoading(false);
            } catch (err) {
                console.error("Error fetching compare list:", err);
                setError("Failed to fetch compare list. Please try again.");
                setLoading(false);
            }
        };

        fetchCompareList();
    }, []);

    // Handle loading and error states
    if (loading) {
        return <p>Loading compare list...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Compare List</h1>
            {compareList.length === 0 ? (
                <p>No agencies added to the compare list yet.</p>
            ) : (
                <ul>
                    {compareList.map((agency) => (
                        <li key={agency._id}>
                            <img src={agency.profilePhoto} alt={agency.fullname} width={50} />
                            <div>
                                <h3>{agency.fullname}</h3>
                                <h3>{agency.proofile.agencyName}</h3>
                                <p>{agency.email}</p>
                            </div>
                            <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden">
                                <a href={`/agency/${agency._id}`}>
                                    <img
                                        src={agency.profile.profilePhoto || "https://via.placeholder.com/40"}
                                        alt={`${agency?.profile?.agencyName || "Agency"} logo`}
                                        className="h-full w-full object-contain"
                                    />
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompareList;
