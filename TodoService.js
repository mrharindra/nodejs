//"use strict";
var fs = require('fs');
var util = require('./util');

class TodoService
{    
    constructor()
    {
        var ldata = fs.readFileSync('TodoCollections.json', 'utf8');    
        if(ldata){
            this.data = JSON.parse(ldata);
        }
        else{
            this.data = [];
        }            
    }

    getAllTodos(authContext)
    {
        var notes = [];
        for(var i in this.data){
            //let cloneData = Object.assign({}, this.data[i]);            
            if( authContext && authContext.userId != this.data[i].createdBy )
            {
                continue;
            }            
            notes.push( this.data[i] );            
        }        
        return notes;
    };

    getTodo(todoId,authContext)
    {        
        for (var i in this.data)
        {            
            if(this.data[i].id == todoId)
            {          
                if( authContext && authContext.userId != this.data[i].createdBy )
                {
                    throw "Unauthorized";                                        
                }                
                return this.data[i];
            }
        }
        return null;    
    }

    addTodo(todo, authContext)
    {        
        var newTodo = {};
        newTodo.id = util.unique();
        newTodo.title = todo.title;
        newTodo.desc = todo.desc;
        
        if( authContext ){
            newTodo.createdBy = authContext.userId;
            newTodo.lmBy = authContext.userId;
        }

        newTodo.isFavorite = false;
        if( todo.isFavorite){
            newTodo.isFavorite = todo.isFavorite;
        }
        newTodo.creationTime = Date.now();
        newTodo.lmTime = newTodo.creationTime;        
        
        this.data.push(newTodo);

        // Write data in file
        var json = JSON.stringify( this.data );
        fs.writeFile('TodoCollections.json', json, 'utf8', function(){
            console.log("New TODO saved in file");
        });

        return newTodo;
    }
    
    updateTodo(todoId, todo, authContext)
    {
        if(!todo.isFavorite)
        {
            todo.isFavorite = false;
        }
        
        for (var i in this.data)
        {
            if(this.data[i].id == todoId)
            {
                if( authContext && authContext.userId != this.data[i].createdBy )
                {
                    throw "Unauthorized";                                        
                }

                var oldObj = this.data[i];

                oldObj.lmTime =  Date.now();
                oldObj.title = todo.title;
                oldObj.desc = todo.desc;
                oldObj.isFavorite = todo.isFavorite;
                if( authContext ){
                    oldObj.lmBy = authContext.userId;                    
                }
                // Write data in file
                let json = JSON.stringify(this.data);
                fs.writeFile('TodoCollections.json', json, 'utf8',function(){
                    console.log("TODO is updated in file");
                });

                return oldObj;
            }
        }
        
        return null;
    }

    deleteTodo(todoId, authContext)
    {        
        for (var i in this.data)
        {                        
            if(this.data[i].id == todoId)
            { 
                if( authContext && authContext.userId != this.data[i].createdBy )
                {
                    throw "Unauthorized";                                        
                }                
                
                // Remove data from file   
                let json = JSON.stringify(this.data);
                fs.writeFileSync('TodoCollections.json', json, 'utf8', function(){
                    console.log("TODO is deleted from file");
                });

                return this.data[i];
            }
        }           

        return null;
    }
    
};

module.exports = TodoService;