const mongoose=require('mongoose');

productSchema=mongoose.Schema({
    name:{
        type:[String ,"invalid data"],
        required:true
    },
    description:{
        type:[String ,"invalid data"],
        required:true
    },
    
    category:{
        type:[String ,"invalid category"],
        enum:["electronics","books","clothes","food","others"],
        default:"others"
    },
    price:{
        type:[Number ,"invalid price"],
        required:true
    },
    dateCreated:{
        type:[Date ,"invalid date"],
        default:Date.now
    }}

);

module.exports=mongoose.model("Product",productSchema);