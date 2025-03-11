const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const token = req.body.token
    console.log(req.body, "req.body------");
    console.log(token, "token------");
    if(!token){
      return res.status(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, userData)=>{
        if(err){
            return res.status(401).json({"message" : "Token Expired. Please login again"})
        }
        req.user = userData
        console.log('req.user--', userData)
        next()
    })
  }
module.exports = {verifyToken}