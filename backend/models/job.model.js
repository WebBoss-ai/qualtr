import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        enum: [
    'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
    'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
    'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
    'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
    'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management'
],
required: true
    }],
    salary: {
        type: Number,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    requirement_doc: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", jobSchema);

export default Job;
