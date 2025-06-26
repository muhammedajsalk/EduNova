const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../../confiq/cloudinary')
const instructorModel = require('../../models/instructorModel')


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req,file) => {
        const instructorName = req.body.name?.replace(/\s+/g, '_').toLowerCase();
        const folder = `eduNova/instructors/${instructorName || 'unknown'}`;
        let resource_type = file.mimetype.startsWith('video') ? 'video' : 'auto';
        return {
            folder,
            resource_type,
            public_id: `${Date.now()}-${file.originalname}`, // Unique file name
        };
    }
})

const upload=multer({storage})

module.exports=upload