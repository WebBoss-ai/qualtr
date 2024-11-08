import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        agencyName: { type: String },
        slogan: { type: String },
        location: { type: String },
        overview: { type: String },
        numberOfEmployees: { type: Number },
        budgetRange: {
            min: { type: Number },
            max: { type: Number }
        },
        servicesOffered: [{ type: String }], // Digital marketing services
        expertise: [{ type: String }], // Select up to 5 services
        industries: [{ type: String }], // List of industries
        portfolio: [
            {
                title: { type: String },
                challenge: { type: String }, // Problem faced by the company
                solution: { type: String }, // Approach to solve the problem
                result: { type: String },   // Outcome of the solution
            }
        ],
        pastClients: [{ type: String }],
        awards: [
            {
                awardName: { type: String },
                link: { type: String }, // Optional
                year: { type: Number }
            }
        ],
        yearFounded: { type: Number }
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export default User;