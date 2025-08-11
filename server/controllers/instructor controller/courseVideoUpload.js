async function courseVideoUpload(req,res){
    try {
        const videoUrl = req.files?.video?.[0]?.path;
        if (!videoUrl) throw new Error("Video not uploaded");
        res.status(200).json({success:true,message:"succefully uploaded",videoUrl:videoUrl})
    } catch (error) {
        console.log("server side error: " + error)
        res.status(500).json({ success: false, message: "server side error" })
    }
}


module.exports=courseVideoUpload