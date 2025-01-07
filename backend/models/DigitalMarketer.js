import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    employmentType: { type: String, required: true },
    company: { type: String, required: true },
    isCurrent: { type: Boolean, required: true },
    startDate: {
        month: { type: String, required: true },
        year: { type: String, required: true },
    },
    endDate: {
        month: { type: String },
        year: { type: String },
    },
    location: { type: String, required: true },
    locationType: { type: String },
    description: { type: String },
});

const educationSchema = new mongoose.Schema({
    school: { type: String, required: true }, // School name, required field
    degree: { type: String, required: true }, // Degree name, e.g., Bachelor’s
    fieldOfStudy: { type: String, required: true }, // Field of study, e.g., Business
    startDate: {
        month: { type: String }, // Start date - Month
        year: { type: String },  // Start date - Year
    },
    endDate: {
        month: { type: String }, // End date (or expected) - Month
        year: { type: String },  // End date (or expected) - Year
    },
    grade: { type: String }, // Grade, optional
    activitiesAndSocieties: { 
        type: String, 
        maxlength: 500, // Max 500 characters
    }, 
    description: { 
        type: String, 
        maxlength: 1000, // Max 1000 characters
    },
});

const digitalMarketerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        fullname: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        agencyName: {
            type: String,
        },
        bio: {
            type: String,
        },
        skills: [{
            type: String,
        }],
        location: {
            type: String,
        },
        profilePhoto: {
            type: String,
            default: '',
        },
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    experiences: [experienceSchema],
    education: [educationSchema], 
}, { timestamps: true });

export const DigitalMarketer = mongoose.model('DigitalMarketer', digitalMarketerSchema);
export default DigitalMarketer;
