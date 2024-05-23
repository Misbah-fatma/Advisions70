const mongoose=require('mongoose')
const userSchema= mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    role:{
        type: String,
        default: "Student"
    },
    active: {
        type: Boolean,
        default: false, // By default user will be inactive
      },
      codeHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }],
    
    
},

{timestamps: true})

const UserModel=mongoose.model("User", userSchema)

module.exports=UserModel