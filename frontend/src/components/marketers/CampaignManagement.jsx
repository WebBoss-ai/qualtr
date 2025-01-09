import React, { useState, useEffect } from "react";
import axios from "axios";
import { MARKETER_API_END_POINT } from "@/utils/constant";

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    replaceImages: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [campaignId, setCampaignId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    console.log("Fetching campaigns from:", `${MARKETER_API_END_POINT}/campaigns`);
    try {
      const response = await axios.get(`${MARKETER_API_END_POINT}/campaigns`);
      console.log("Fetch campaigns response:", response.data);
      if (response.data.success) {
        setCampaigns(response.data.campaigns);
      } else {
        console.error("Fetch campaigns failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    console.log(`Input change [${name}]:`, newValue);
    setFormData({ ...formData, [name]: newValue });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);
    setFormData({ ...formData, images: files });
  };

  const handleImageRemove = (index) => {
    console.log(`Removing image at index ${index}`);
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submit:", formData);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("replaceImages", formData.replaceImages);
      if (editMode) form.append("campaignId", campaignId);
      formData.images.forEach((image) => form.append("images", image));

      console.log("Submitting form to:", editMode
        ? `${MARKETER_API_END_POINT}/campaigns/edit`
        : `${MARKETER_API_END_POINT}/campaigns/add`);
      const response = editMode
        ? await axios.put(`${MARKETER_API_END_POINT}/campaigns/edit`, form)
        : await axios.post(`${MARKETER_API_END_POINT}/campaigns/add`, form);

      console.log("Submit response:", response.data);
      if (response.data.success) {
        fetchCampaigns();
        resetForm();
      } else {
        console.error("Submit failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    console.log("Editing campaign:", campaign);
    setEditMode(true);
    setCampaignId(campaign._id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      images: [],
      replaceImages: false,
    });
    setExistingImages(campaign.images);
  };

  const handleDelete = async (id) => {
    console.log("Deleting campaign with ID:", id);
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await axios.delete(
        `${MARKETER_API_END_POINT}/campaigns/delete/${id}`
      );
      console.log("Delete response:", response.data);
      if (response.data.success) {
        fetchCampaigns();
      } else {
        console.error("Delete failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const resetForm = () => {
    console.log("Resetting form");
    setEditMode(false);
    setCampaignId(null);
    setFormData({ title: "", description: "", images: [], replaceImages: false });
    setExistingImages([]);
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

        {/* Existing Images */}
        {editMode && existingImages.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Existing Images</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={image.Location}
                    alt={`Existing Image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replace Images Option */}
        {editMode && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              <input
                type="checkbox"
                name="replaceImages"
                checked={formData.replaceImages}
                onChange={handleInputChange}
                className="mr-2"
              />
              Replace Existing Images
            </label>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Images</label>
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
