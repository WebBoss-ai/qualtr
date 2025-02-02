import VCProfile from '../models/VCProfile.js';

export const getAllVCs = async (req, res) => {
    try {
        const vcs = await VCProfile.find();
        res.status(200).json({ success: true, vcs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getVCById = async (req, res) => {
    try {
        const vc = await VCProfile.findById(req.params.id);
        if (!vc) return res.status(404).json({ success: false, message: 'VC not found' });
        res.status(200).json({ success: true, vc });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createVC = async (req, res) => {
    try {
        const newVC = new VCProfile(req.body);
        await newVC.save();
        res.status(201).json({ success: true, vc: newVC });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateVC = async (req, res) => {
    try {
        const updatedVC = await VCProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVC) return res.status(404).json({ success: false, message: 'VC not found' });
        res.status(200).json({ success: true, vc: updatedVC });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteVC = async (req, res) => {
    try {
        const deletedVC = await VCProfile.findByIdAndDelete(req.params.id);
        if (!deletedVC) return res.status(404).json({ success: false, message: 'VC not found' });
        res.status(200).json({ success: true, message: 'VC deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
