var express = require('express');
var bodyParser = require('body-parser')
var jwtUtil = require('./jwtUtil');
var config = require('./config');
var cors = require('cors')

var commonController = require('./CommonController');
var todoController = require('./TodoController');
var userController = require('./UserController');



var app = express();
//app.use(express.urlencoded({ extended: true })) 

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods:['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders:['Authorization', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    exposedHeaders:['Content-Type'],
    credentials:true,
    preflightContinue: false,
}

app.use( cors(corsOptions));

app.use( bodyParser.json() );

app.use(async (req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Expose-Headers", "Content-Type");

    //console.log( req.method );

    if(req.method == "OPTIONS" || req.method == "options")
    {
      //  return;
    }
    
    if(isAuthRequired(req.originalUrl) == false)
    {
        req.authContext = {userId:0,name:'system'};
        next();
        return;
    }
    
    var payload = validateAuth(req,res);
    if( payload == null)
    {
        return;
    }
    req.authContext = payload;
    next();            
});


commonController(app);
todoController(app);
userController(app);

const publicApi = ['','/', '/signup', '/signup/','/login', '/login/','/config','/config/'];

function isAuthRequired(api)
{    
    if( config.isByPassAuth() )
    {
        return false;
    }
    var i = api.indexOf('?');
    if(  i > -1){
        api = api.substring(0, i);
    }
    
    if( publicApi.indexOf(api) == -1)
    {
        return true;
    }
    return false;
}

function validateAuth(req, res)
{
    let authHeader = req.header('Authorization');
    if(!authHeader)
    {
        res.sendStatus(401);
        return false;
    }
    
    authHeader = authHeader.replace('Bearer ','').replace('bearer ','');

    var obj = jwtUtil.verifyToken(authHeader);

    if( obj == null)
    {
        res.sendStatus(401);
        return null;
    }

    return obj;
}


var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});