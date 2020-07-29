var fs = require('fs');
var config = require('./config');

module.exports = function(app) {

    app.get('/', function(req, res){    
        //var hostname = req.protocol+'://'+ req.headers.host;
        var greet2 = fs.readFile(__dirname + '/index.html', 'utf8', function(err, data) {
            //res.send(data.replace('{HOST_NAME}', hostname));
            res.send(data);
        });
    
    });
    
    app.get('/config', function(req, res){
        
        if(req.query.auth == 1 )
        {
            config.setByPassAuth(false);
        }
        if(req.query.auth == 0 )
        {
            config.setByPassAuth(true);            
        }
        if(req.query.jwt_exp > 1 )
        {
            let jwtExpTime = Number.parseInt(req.query.jwt_exp);
            config.setJwtExpTime(jwtExpTime);
        }
    
        res.send({  authRequired:!config.isByPassAuth(),
                    jwtExpiresInSeconds:config.getJwtExpTime()
            });
    });

}