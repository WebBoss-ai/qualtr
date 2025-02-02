import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { VC_API_END_POINT } from "@/utils/constant";

const VCForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fundName: '',
        fundType: '',
        fundWebsite: '',
        minChequeSize: '',
        maxChequeSize: '',
        stageOfInvestment: '',
        categoriesOfInterest: '',
        typeOfFinancing: '',
        linkedInPage: '',
        thesis: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`${VC_API_END_POINT}/${id}`)
                .then(res => setFormData(res.data.vc))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = id ? `${VC_API_END_POINT}/${id}` : VC_API_END_POINT;
        const method = id ? axios.put : axios.post;
    
        method(url, formData)
            .then(() => navigate('/vcs'))
            .catch(err => console.error(err));
    };
    

    return (
        <div>
            <h2>{id ? 'Edit' : 'Add'} VC Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="fundName" placeholder="Fund Name" value={formData.fundName} onChange={handleChange} required />
                <input type="text" name="fundType" placeholder="Fund Type" value={formData.fundType} onChange={handleChange} required />
                <input type="url" name="fundWebsite" placeholder="Fund Website" value={formData.fundWebsite} onChange={handleChange} required />
                <input type="number" name="minChequeSize" placeholder="Min Cheque Size" value={formData.minChequeSize} onChange={handleChange} required />
                <input type="number" name="maxChequeSize" placeholder="Max Cheque Size" value={formData.maxChequeSize} onChange={handleChange} required />
                <input type="text" name="stageOfInvestment" placeholder="Stage of Investment (comma-separated)" value={formData.stageOfInvestment} onChange={handleChange} required />
                <input type="text" name="categoriesOfInterest" placeholder="Categories of Interest (comma-separated)" value={formData.categoriesOfInterest} onChange={handleChange} required />
                <input type="text" name="typeOfFinancing" placeholder="Type of Financing (comma-separated)" value={formData.typeOfFinancing} onChange={handleChange} required />
                <input type="url" name="linkedInPage" placeholder="LinkedIn Page" value={formData.linkedInPage} onChange={handleChange} required />
                <textarea name="thesis" placeholder="Thesis" value={formData.thesis} onChange={handleChange} required />
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default VCForm;
