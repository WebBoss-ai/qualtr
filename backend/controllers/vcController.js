import VCProfile from '../models/VCProfile.js';
import { getObjectURL, uploadVCLogoToS3 } from '../utils/aws.js'; // Import to fetch S3 URL

export const getAllVCs = async (req, res) => {
    try {
        const vcs = await VCProfile.find();

        const vcsWithLogoURLs = await Promise.all(
            vcs.map(async (vc) => ({
                ...vc.toObject(),
                logo: vc.logo ? await getObjectURL(vc.logo) : null,
            }))
        );

        res.status(200).json({ success: true, vcs: vcsWithLogoURLs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getRandomVCs = async (req, res) => {
    try {
        const vcs = await VCProfile.aggregate([{ $sample: { size: 5 } }]);
        
        const vcsWithLogoURLs = await Promise.all(
            vcs.map(async (vc) => ({
                ...vc,
                logo: vc.logo ? await getObjectURL(vc.logo) : null,
            }))
        );

        res.status(200).json({ success: true, vcs: vcsWithLogoURLs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getVCById = async (req, res) => {
    try {
        const vc = await VCProfile.findById(req.params.id);
        if (!vc) return res.status(404).json({ success: false, message: 'VC not found' });

        // Fetch S3 URL for logo
        const logoURL = vc.logo ? await getObjectURL(vc.logo) : null;

        res.status(200).json({ success: true, vc: { ...vc.toObject(), logo: logoURL } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createVC = async (req, res) => {
    try {
        let logoKey = ''; // Default empty logo key

        if (req.file) {
            const s3Response = await uploadVCLogoToS3(req.file);
            logoKey = `vc_logo/${req.file.originalname}`; // Store only S3 key, not full URL
        }

        const newVC = new VCProfile({ ...req.body, logo: logoKey });
        await newVC.save();

        // Fetch logo URL from S3
        const logoURL = logoKey ? await getObjectURL(logoKey) : null;

        res.status(201).json({ success: true, vc: { ...newVC.toObject(), logo: logoURL } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateVC = async (req, res) => {
    try {
        let logoKey = req.body.logo; // Keep existing logo if no new file is uploaded

        if (req.file) {
            const s3Response = await uploadVCLogoToS3(req.file);
            logoKey = `vc_logo/${req.file.originalname}`;
        }

        const updatedVC = await VCProfile.findByIdAndUpdate(
            req.params.id,
            { ...req.body, logo: logoKey },
            { new: true }
        );

        if (!updatedVC) return res.status(404).json({ success: false, message: 'VC not found' });

        const logoURL = logoKey ? await getObjectURL(logoKey) : null;

        res.status(200).json({ success: true, vc: { ...updatedVC.toObject(), logo: logoURL } });
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
