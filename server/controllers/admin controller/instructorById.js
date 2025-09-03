const instructorModel = require("../../models/instructorModel")

async function instructorById(req, res) {
    try {
        const { id } = req.params
        const instructor = await instructorModel.findById(id)
        if (!instructor) return res.status(400).json({ success: false, message: "the instructor not available" })
        res.status(200).json({ success: true, data: instructor })
    } catch (error) {
        console.log("server side errord: " + error)
        res.status(500).json({ success: false, message: "server side error" })
    }
}

module.exports=instructorById