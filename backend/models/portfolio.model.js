const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true }, // Project Title
    challenge: { type: String, required: true }, // Challenge faced by the client
    solution: { type: String, required: true }, // Solution provided by the agency
    result: { type: String, required: true }, // Results achieved (impact, KPIs)
    projectDuration: { type: String }, // Duration of the project (e.g., 6 months)
    technologiesUsed: [{ type: String }], // Technologies or tools used
    images: [{ type: String }], // URLs of portfolio images
    link: { type: String }, // Optional link to the project
    testimonials: { type: String }, // Optional client feedback or testimonial
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
