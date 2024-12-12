import mongoose from "mongoose";

const compareListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
    agencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of agency IDs
});

const CompareList = mongoose.model("CompareList", compareListSchema);
export default CompareList;
