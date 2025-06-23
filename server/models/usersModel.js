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
        type:String,
        default:"https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-blue-icon-png-image_3917504.jpg"
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

const userModel=mongoose.model('users',userSchema)

module.exports=userModel