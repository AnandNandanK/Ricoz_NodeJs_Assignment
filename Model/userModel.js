import mongoose from "mongoose";

const userSchema=mongoose.Schema({


    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phoneNumber:{
        type:Number,
        required:true
    },

},{timestamp:true})

const User=mongoose.model("User",userSchema);
export default User;