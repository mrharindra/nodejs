var bodyParser = require('body-parser');
const TodoService = require('./TodoService');
var todoService = new TodoService();

module.exports = function(app) {
    
    app.get('/todo', function(req, res){
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        var data = todoService.getAllTodos(req.authContext);    
        res.json(data);
    });
    
    app.get('/todo/:todoId', function (req, res) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        
        var todo = null;
        try{
            todo = todoService.getTodo(req.params.todoId, req.authContext);
        }
        catch(e){
            res.sendStatus(403);
            return;
        }
        if(todo){
            res.json(todo);
        }
        else{
            res.sendStatus(404);
        }
    })
    
    app.post('/todo', function(req, res){
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        var data = req.body;    
        var todo = todoService.addTodo( data, req.authContext );
        res.send( todo );
    });
    
    app.put('/todo/:todoId', function (req, res) {    
        res.setHeader('Content-Type', 'application/json;charset=utf-8');    
        var todo = null;
        try{
            todo = todoService.updateTodo(req.params.todoId, req.body, req.authContext);
        }
        catch(e){
            res.sendStatus(403);
            return;
        }
    
        if(todo){
            res.json(todo);
        }
        else{
            res.sendStatus(404);
        }	
    })
    
    app.delete('/todo/:todoId', function(req, res){
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
    
        try{
            todoService.deleteTodo(req.params.todoId, req.authContext);
        }
        catch(e){
            res.sendStatus(403);
            return;
        }
        
        var resp = {"message":"Todo is deleted successfully"};
        res.send(resp);
    });
    	
}