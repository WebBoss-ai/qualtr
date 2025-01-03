import mongoose from 'mongoose';

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
}, { timestamps: true });

export const DigitalMarketer = mongoose.model('DigitalMarketer', digitalMarketerSchema);
export default DigitalMarketer;
