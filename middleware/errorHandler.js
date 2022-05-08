const errorHandler= (err, req, res, next) => {
    console.log(err);
    if(err.statusCode){
        res.status(err.statusCode).send(err.message);
    }
    else{
    res.status(500).json({msg:err.message});
}
}
module.exports=errorHandler;