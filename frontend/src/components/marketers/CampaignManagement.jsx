import React, { useState, useEffect } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${MARKETER_API_END_POINT}/campaigns`); // Replace with your API endpoint
      if (response.data.success) {
        setCampaigns(response.data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      formData.images.forEach((image) => form.append("images", image));

      let response;
      if (editMode) {
        form.append("campaignId", campaignId);
        response = await axios.put(`${MARKETER_API_END_POINT}/campaigns/edit`, form); // Replace with your API endpoint
      } else {
        response = await axios.post(`${MARKETER_API_END_POINT}/campaigns/add`, form); // Replace with your API endpoint
      }

      if (response.data.success) {
        fetchCampaigns();
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditMode(true);
    setCampaignId(campaign._id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      images: [], // Keep it empty to allow uploading new images
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await axios.delete(`${MARKETER_API_END_POINT}/campaigns/delete/${id}`); // Replace with your API endpoint
      if (response.data.success) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setCampaignId(null);
    setFormData({ title: "", description: "", images: [] });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Campaign Management</h1>

      {/* Campaign Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editMode ? "Update Campaign" : "Add Campaign"}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">{campaign.title}</h2>
            <p className="text-sm text-gray-600">{campaign.description}</p>
            <div className="mt-4">
              {campaign.images.map((image, index) => (
                <img
                  key={index}
                  src={image.Location}
                  alt={`Campaign ${index + 1}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(campaign)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(campaign._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignManagement;