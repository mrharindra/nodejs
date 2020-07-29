//"use strict";
var fs = require('fs');
var util = require('./util');

class UserService{    
    constructor()
    {
        var ldata = fs.readFileSync('UserCollections.json', 'utf8');    
        if(ldata){
            this.data = JSON.parse(ldata);
        }
        else{
            this.data = [];
        }            
    }

    getAllUsers()
    {
        var users = [];
        for(var i in this.data){
            let cloneData = Object.assign({}, this.data[i]);
            delete cloneData.password;            
            users.push( cloneData );
        }        
        return users;
    };

    getUser(userId)
    {        
        for (var i in this.data)
        {
            if(this.data[i].id == userId)
            {                
                let cloneData = Object.assign({}, this.data[i]);
                delete cloneData.password;
                return cloneData;
            }
        }
        return null;    
    }

    addUser(user)
    {        
        var newUser = {};
        newUser.id = util.unique();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = user.password;    
        newUser.creationTime = Date.now();
        newUser.lmTime = newUser.creationTime;        
        
        this.data.push(newUser);

        // Write data in file
        var json = JSON.stringify( this.data );
        fs.writeFile('UserCollections.json', json, 'utf8', function(){
            console.log("New user saved in file");
        });

        return newUser;
    }
    
    updateUser(userId, user)
    {
        for (var i in this.data)
        {
            if(this.data[i].id == userId)
            {
                var oldObj = this.data[i];

                oldObj.lmTime =  Date.now();
                oldObj.name = user.name;
                oldObj.email = user.email;
                oldObj.password = user.password;

                // Write data in file
                let json = JSON.stringify(this.data);
                fs.writeFile('UserCollections.json', json, 'utf8',function(){
                    console.log("User is updated in file");
                });

                return oldObj;
            }
        }
        
        return null;
    }

    deleteUser(userId)
    {        
        for (var i in this.data)
        {                        
            if(this.data[i].id == userId)
            {
                this.data.splice(i,1);             
                
                // Remove data from file   
                let json = JSON.stringify(this.data);
                fs.writeFileSync('UserCollections.json', json, 'utf8', function(){
                    console.log("User is deleted from file");
                });

                return this.data[i];
            }
        }           

        return null;
    }



    login(loginData)
    {        
        for (var i in this.data)
        {
            if(this.data[i].email == loginData.email)
            {      
                if(this.data[i].password == loginData.password)
                {
                    return this.data[i];
                }                
            }
        }
        return null;    
    }    
    
};

module.exports = UserService;