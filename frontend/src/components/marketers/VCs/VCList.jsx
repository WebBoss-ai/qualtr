import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { VC_API_END_POINT } from "@/utils/constant";

const VCList = () => {
    const [vcs, setVcs] = useState([]); // Ensure state is initialized as an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${VC_API_END_POINT}/`)
            .then(res => {
                setVcs(res.data.vcs || []); // Fallback to an empty array if undefined
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load VC profiles');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>VC Profiles</h2>
            <Link to="/vc/add">Add VC</Link>
            {vcs.length === 0 ? (
                <p>No VC profiles available.</p>
            ) : (
                <ul>
                    {vcs.map(vc => (
                        <li key={vc._id}>
                            <img src={vc.logo} alt={vc.fundName} width="50" height="50" onError={(e) => e.target.src = '/default-logo.png'} />
                            <Link to={`/vc/${ vc._id }`}>{vc.fundName}</Link> - 
                            <Link to={`/vc/edit/${ vc._id }`} style={{ marginLeft: '10px' }}>Edit</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VCList;