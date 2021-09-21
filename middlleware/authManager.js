const jwt = require("jsonwebtoken");
const Member = require("../module/member");

const auth = async (req,res,next)=> {
    if(!req.header('Authorization'))    // ?????
    {
        res.status(301).send({error: "Not Authrization to this resource"})
    }
    else{
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token,process.env.JWT_KEY)
    try
    {
        const customer = await Customer.findOne({_id:data._id,'tokens.token': token})
        if(!customer)
        {
            res.status(301).send({error: "Not Authrization to this resource"})
        }
        req.customer = customer
        req.token = token
        next()
    }
    catch (error)
    {
        res.status(401).send({error: "Not Authrization to this resource"})
    }}
}


module.exports = auth;