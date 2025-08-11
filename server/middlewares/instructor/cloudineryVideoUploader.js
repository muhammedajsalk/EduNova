const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../../confiq/cloudinary')


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req,file) => {
        const instructorName = req.body.name?.replace(/\s+/g, '_').toLowerCase();
        const instractorId=req.user.id
        const folder = `eduNova/courses/${instructorName ||instractorId|| 'unknown'}/lettureVideo`;
        let resource_type = file.mimetype.startsWith('video') ? 'video' : 'auto';
        const ext = file.originalname.split('.').pop();
        return {
            folder,
            resource_type,
            public_id: `${Date.now()}.${ext}`
        };
    }
})

const upload=multer({storage})

module.exports=upload