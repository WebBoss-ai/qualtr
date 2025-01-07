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
}, { timestamps: true });

export const DigitalMarketer = mongoose.model('DigitalMarketer', digitalMarketerSchema);
export default DigitalMarketer;
