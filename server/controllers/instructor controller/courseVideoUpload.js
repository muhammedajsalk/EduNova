async function courseVideoUpload(req,res){
    try {
        const videoUrl = req.files?.video?.[0]?.path;
        res.status(200).json({success:true,message:"succefully uploaded",videoUrl:videoUrl})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}


module.exports=courseVideoUpload