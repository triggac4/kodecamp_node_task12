const invalidRoute=async (req,res,next)=>{
    res.status(404).send('invalid route');
}

module.exports=invalidRoute;