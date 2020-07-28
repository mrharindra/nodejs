//import jwt from './jsonwebtoken';

var jwt = require('jsonwebtoken')
const SECRET_KEY = "thisisdummysecret@2020";

exports.generateJWTToken = (userData) =>{
    return jwt.sign(userData, SECRET_KEY);
};

exports.verifyToken = (jwtToken) =>{
    try{
       return jwt.verify(jwtToken, SECRET_KEY);
    }
    catch(e){
       console.log('e:',e);
       return null;
    }
};