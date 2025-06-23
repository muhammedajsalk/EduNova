const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    subscription:{
        type:Object,
        default:{
            plan:"none",
            status:"none",
            startDate:"none",
            endDate:"none"
        }
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
},
{
  timestamps: true
}
)

const userModel=mongoose.model('Users',userSchema)

module.exports=userModel