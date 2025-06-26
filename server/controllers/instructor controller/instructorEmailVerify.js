async function instructorEmailVerify(req,res){
    try{
        res.status(200).json({success:true,message:"instractor email is verfied"})
    }catch(err){
        res.status(400).json({success:false,message:"server side error"})
    }
}

module.exports=instructorEmailVerify