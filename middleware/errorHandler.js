// {
//     id: Unique, // MongoDB generated
//     name: String,
//     description: String,
//     category: String,
//     price: Number,
//     dateCreated: Date // Set default date to Date.now
//     }

const errorHandler= (err, req, res, next) => {
    if(err.statusCode){
        res.status(err.statusCode).send(err.message);
    }
    else{
    res.status(500).send('Something broke!');
}
}
module.exports=errorHandler;