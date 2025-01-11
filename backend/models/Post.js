import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DigitalMarketer',
        required: true,
    }, // Reference to the DigitalMarketer who created the post
    category: {
        type: String,
        enum: [
            'Brand Strategy & Identity',     // 1
            'Memes & Marketing Fun',         // 4
            'Content Creation & Design',     // 3
            'Digital Marketing',             // 2
        ], // Define the allowed categories
        required: true,
    },
    text: {
        type: String,
        maxlength: 2000, // Limit for text length
    },
    media: {
        photos: { type: [String], metadata: Object, validate: [arrayLimit, '{PATH} exceeds the limit of 10'] },
        videos: { type: [String], metadata: Object, validate: [arrayLimit, '{PATH} exceeds the limit of 5'] },
    },
    event: {
        title: { type: String },
        description: { type: String },
        date: { type: Date },
        location: { type: String },
    },
    occasion: {
        title: { type: String },
        description: { type: String },
        date: { type: Date },
    },
    jobOpening: {
        title: { type: String },
        description: { type: String },
        location: { type: String },
        salaryRange: { type: String },
    },
    poll: {
        question: { type: String },
        options: {
            type: [String],
            validate: [arrayLimitPollOptions, '{PATH} exceeds the limit of 4'], // Max 4 options
        },
        endDate: { type: Date },
    },
    document: {
        name: { type: String },
        url: { type: String },
    },
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 10;
}

function arrayLimitPollOptions(val) {
    return val.length <= 4;
}

export const Post = mongoose.model('Post', postSchema);
export default Post;
