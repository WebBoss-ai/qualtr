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
            'Startup Essentials',            // 5
            'Marketing & Branding',          // 6
            'Legal & Compliance',            // 7
            'Finance & Investment',          // 8
            'Sales & Customer Acquisition',  // 9
            'Technology & Tools',            // 10
            'Inspirations',                  // 11
        ],
        required: true,
    },
    text: {
        type: String,
        maxlength: 2000, // Limit for text length
    },
    media: {
        photos: {
            type: [
                {
                    url: { type: String, required: true }, // The photo URL
                    metadata: {
                        size: { type: Number }, // File size in bytes
                        format: { type: String }, // Format of the image (e.g., jpg, png)
                        dimensions: { // Dimensions of the image
                            width: { type: Number },
                            height: { type: Number },
                        },
                    },
                }
            ],
            validate: [arrayLimit, '{PATH} exceeds the limit of 10'], // Max 10 photos
        },
        videos: {
            type: [
                {
                    url: { type: String, required: true }, // The video URL
                    metadata: {
                        duration: { type: Number }, // Duration in seconds
                        resolution: { type: String }, // Resolution (e.g., 1080p)
                        format: { type: String }, // Format (e.g., mp4)
                    },
                }
            ],
            validate: [arrayLimit, '{PATH} exceeds the limit of 5'], // Max 5 videos
        },
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
        votes: {
            type: Map,
            of: Number, // Maps each option to the number of votes
            default: {}, // Initialize as an empty map
        },
    },

    document: {
        name: { type: String },
        url: { type: String },
    },
    trending: { type: Boolean, default: false },
    impressions: { type: Number, default: 0 },
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 10;
}

function arrayLimitPollOptions(val) {
    return val.length <= 4;
}

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer', required: true },
        text: { type: String, required: true },
        replies: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer', required: true },
                text: { type: String, required: true },
                taggedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer' }],
            },
        ],
        taggedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer' }],
    },
    { timestamps: true }
);

postSchema.add({
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalMarketer' }], // Array of users who liked the post
    comments: [commentSchema], // Nested comments
});

export const Post = mongoose.model('Post', postSchema);
export default Post;
