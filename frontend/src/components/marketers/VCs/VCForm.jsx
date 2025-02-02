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
        thesis: '',
        logo: ''  // Store existing logo URL
    });
    
    const [selectedFile, setSelectedFile] = useState(null); // Store new logo file

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        
        // Append form fields
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        // Append file if selected
        if (selectedFile) {
            formDataToSend.append("logo", selectedFile);
        }

        try {
            const url = id ? `${VC_API_END_POINT}/${id}` : VC_API_END_POINT;
            const method = id ? axios.put : axios.post;

            await method(url, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            navigate('/vcs');
        } catch (err) {
            console.error(err);
        }
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

                {/* Logo Upload */}
                <label>Upload Logo:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />

                {/* Display Existing Logo */}
                {formData.logo && (
                    <div>
                        <p>Current Logo:</p>
                        <img src={formData.logo} alt="VC Logo" width="100" height="100" />
                    </div>
                )}

                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default VCForm;