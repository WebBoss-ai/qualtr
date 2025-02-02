import mongoose from 'mongoose';

const VCProfileSchema = new mongoose.Schema({
    fundName: { type: String, required: true },
    logo: { type: String, default: '' },
    fundType: { type: String, required: true },
    fundWebsite: { type: String, required: true },
    minChequeSize: { type: Number, required: true },
    maxChequeSize: { type: Number, required: true },
    stageOfInvestment: { type: [String], required: true },
    categoriesOfInterest: { type: [String], required: true },
    typeOfFinancing: { type: [String], required: true },
    linkedInPage: { type: String, required: true },
    thesis: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('VCProfile', VCProfileSchema);