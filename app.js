var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
const TodoService = require('./TodoService');
const UserService = require('./UserService');
var jwtUtil = require('./jwtUtil');
var todoService = new TodoService();
var userService = new UserService();

var app = express();
//app.use(express.urlencoded({ extended: true })) 

app.use( bodyParser.json() );

app.use(async (req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");

    if(isAuthRequired(req.originalUrl) == false)
    {
        next();
        return;
    }
    
    var isAuth = validateAuth(req,res);
    if( isAuth == false)
    {
        return;
    }

    next();            
});

app.get('/', function(req, res){

    var hostname = req.protocol+'://'+ req.headers.host;
    var greet2 = fs.readFile(__dirname + '/index.html', 'utf8', function(err, data) {
        //console.log(data);
        res.send(data.replace('{HOST_NAME}', hostname));
    });



});

app.get('/todo', function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var data = todoService.getAllTodos();    
	res.json(data);
});

app.get('/todo/:todoId', function (req, res) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var todo = todoService.getTodo(req.params.todoId);
    if(todo){
        res.json(todo);
    }
    else
    {
        res.sendStatus(404);
    }
})

app.post('/todo', function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var data = req.body;    
    var todo = todoService.addTodo( data );
	res.send( todo );
});

app.put('/todo/:todoId', function (req, res) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var todo = todoService.updateTodo(req.params.todoId, req.body)
    if(todo){
        res.json(todo);
    }
    else
    {
        res.sendStatus(404);
    }	
})

app.delete('/todo/:todoId', function(req, res){
    todoService.deleteTodo(req.params.todoId);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var resp = {"message":"Todo is deleted successfully"};
	res.send(resp);
});

// ==== TODO End==============//










// =======User ======================//

app.post('/signup', function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var data = req.body;    
    var user = userService.addUser( data );
	res.send( user );
});

app.post('/login', function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var data = req.body;    
    var user = userService.login( data );    
    if(user){
        let token = jwtUtil.generateJWTToken( user );
        res.send({"token" : token, "type":"Bearer"} );
    }
    else
    {
        res.sendStatus(401);
    }	
});


app.get('/user', function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var data = userService.getAllUsers();    
	res.json(data);
});

app.get('/user/:userId', function (req, res) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var user = userService.getUser(req.params.userId);
    if(user){
        res.json(user);
    }
    else
    {
        res.sendStatus(404);
    }
})

app.put('/user/:userId', function (req, res) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var user = userService.updateTodo(req.params.userId, req.body)
    if(user){
        res.json(user);
    }
    else
    {
        res.sendStatus(404);
    }	
})

app.delete('/user/:userId', function(req, res){
    userService.deleteUser(req.params.userId);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var resp = {"message":"User is deleted successfully"};
	res.send(resp);
});


const publicApi = ['','/', '/signup', '/signup/','/login', '/login/'];


function isAuthRequired(api)
{
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

    authHeader = authHeader.replace('Bearer ','').authHeader.replace('bearer ','');

    var obj = jwtUtil.verifyToken(authHeader);
    if( obj == null)
    {
        res.sendStatus(401);
        return false;
    }

    return true;
}


var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});