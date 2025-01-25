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
    school: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    startDate: {
        month: { type: String },
        year: { type: String },
    },
    endDate: {
        month: { type: String },
        year: { type: String },
    },
    grade: { type: String },
    activitiesAndSocieties: {
        type: String,
        maxlength: 500,
    },
    description: {
        type: String,
        maxlength: 1000,
    },
});

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the campaign
    description: { type: String, required: true }, // Description of the campaign
    images: {
        type: [String], // Array of image URLs
        validate: [arrayLimit, '{PATH} exceeds the limit of 10'], // Validation for max 10 images
    },
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 10;
}

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
        fullname: { type: String },
        phoneNumber: { type: String },
        agencyName: { type: String },
        bio: { type: String },
        skills: [{ type: String }],
        location: { type: String },
        website: {type: String, default:''},
        profilePhoto: { type: String, default: '' },
        suggested: { type: Boolean, default: false },
    }, 
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    experiences: [experienceSchema],
    education: [educationSchema],
    campaigns: [campaignSchema], // Embedding campaigns in the digital marketer schema
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer' }], // List of followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer' }], // List of following
}, { timestamps: true });

export const DigitalMarketer = mongoose.model('DigitalMarketer', digitalMarketerSchema);
export default DigitalMarketer;
