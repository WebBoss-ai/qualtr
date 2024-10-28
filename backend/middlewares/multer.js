import multer from 'multer';
import path from 'path';

// Multer config
const storage = multer.memoryStorage(); // Use memory storage to get file buffer directly

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/; // Allow only certain file types
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Unsupported file type!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter
});

export default upload;
