

#Install the dependency
npm install

#Run the App
node app.js


APIs
------------------------------------
Signup	POST	http://example.com/signup

Login	POST	http://example.com/login
 	 
Get all users	GET	http://example.com/user

Get user by ID	GET	http://example.com/user/{id}

Update User	PUT	http://example.com/user/{id}

Delete user	DELETE	http://example.com/user/{id}

User schema
 
            { 
                "name":"",
                "email":"",
                "password":""
            } 
        
TODO

Get all TODOs	GET	http://example.com/todo

Get TODO by ID	GET	http://example.com/todo/{id}

Update TODO	PUT	http://example.com/todo/{id}

Delete TODO	DELETE	http://example.com/todo/{id}


TODO schema
 
            { 
                "id":<number>,
                "title":"",
                "desc":""
                "isFavorite":true,
                "createdBy":<number>,
                "lmBy":<number>,
                "creationTime":<number - time in millis>,
                "lmTime":<number - time in millis>
            } 


Configuration

Set the Auth JWT expiry time (seconds)	GET	http://example.com/config?jwt_exp=3600

Get Configurations	GET	http://example.com/config
