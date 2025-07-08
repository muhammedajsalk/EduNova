async function thumbnailUpload(req,res){
    try {
        const imageUrl = req.files?.image?.[0]?.path;
        res.status(200).json({success:true,message:"succefully uploaded",imageUrl:imageUrl})
    } catch (error) {
        res.status(500).json({ success: false, message: "server side error" })
        console.log("server side error: " + error)
    }
}

module.exports=thumbnailUpload