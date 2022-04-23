const mongo=require('mongoose');

const connect=async(Url)=>{
    await mongo.connect(Url,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
}

module.exports=connect;
