const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../../confiq/cloudinary')


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req,file) => {
        const instructorName = req.body.name?.replace(/\s+/g, '_').toLowerCase();
        const instractorId=req.user.id
        const folder = `eduNova/courses/${instructorName ||instractorId|| 'unknown'}/Tumbanail`;
        let resource_type = file.mimetype.startsWith('video') ? 'video' : 'image';
        return {
            folder,
            resource_type,
            public_id: `${Date.now()}-${file.originalname}`,
        };
    }
})

const upload=multer({storage})

module.exports=upload