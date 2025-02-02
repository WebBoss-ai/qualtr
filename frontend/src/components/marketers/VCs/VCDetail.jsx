import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { VC_API_END_POINT } from "@/utils/constant";

const VCDetail = () => {
    const { id } = useParams();
    const [vc, setVc] = useState(null);

    useEffect(() => {
        axios.get(`${VC_API_END_POINT}/${id}`)
            .then(res => setVc(res.data.vc))
            .catch(err => console.error(err));
    }, [id]);

    if (!vc) return <p>Loading...</p>;

    return (
        <div>
            <h2>{vc.fundName}</h2>
            <img src={vc.logo} alt={vc.fundName} width="50" height="50" onError={(e) => e.target.src = '/default-logo.png'} />
            <p>Type: {vc.fundType}</p>
            <p>Website: <a href={vc.fundWebsite} target="_blank" rel="noopener noreferrer">{vc.fundWebsite}</a></p>
            <p>Minimum Cheque: ${vc.minChequeSize}</p>
            <p>Maximum Cheque: ${vc.maxChequeSize}</p>
            <p>Investment Stage: {vc.stageOfInvestment.join(', ')}</p>
            <p>Categories: {vc.categoriesOfInterest.join(', ')}</p>
            <p>Financing Types: {vc.typeOfFinancing.join(', ')}</p>
            <p>Thesis: {vc.thesis}</p>
            <Link to={`/vc/edit/${id}`}>Edit</Link>
        </div>
    );
};

export default VCDetail;
