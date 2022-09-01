const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
     email:{
        type:String,
        unique:true,
        required:true,
    },
     password:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        required:true,

    },
    // isAdmin:{
    //     type:Boolean,
    //     required:true,
    //     default:false,
    // },



},{
    timestamps:true
})


const User=mongoose.Model("User",userSchema);
module.exports=User;