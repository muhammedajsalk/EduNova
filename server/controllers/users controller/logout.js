const logOut=async (req,res)=>{
    try {
        res.clearCookie('accesTokken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

module.exports=logOut