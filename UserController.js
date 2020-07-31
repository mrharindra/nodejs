const UserService = require('./UserService');
var jwtUtil = require('./jwtUtil');
var config = require('./config');
var userService = new UserService();

module.exports = function(app) {
    
    app.post('/signup', function(req, res){
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        var data = req.body;
        var user = null;
        try{
            user = userService.addUser( data );
        }
        catch(e){
            res.sendStatus(409);            
            return;
        }

        res.send( user );
    });

    app.post('/login', function(req, res){
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        var data = req.body;    
        var user = userService.login( data );    
        if(user)
        {
            let jwtExpTime = config.getJwtExpTime();
            var payload = {name:user.name, email:user.email,userId:user.id};
            let token = jwtUtil.generateJWTToken( payload, jwtExpTime);
            res.send({ "token" : token,
                        "type":"Bearer",
                        "expiresInSeconds":jwtExpTime-1
                } );
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


    const publicApi = ['','/', '/signup', '/signup/','/login', '/login/','/config','/config/'];

    function isAuthRequired(api)
    {    
        if( byPassAuth )
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
    
    	
}