
var byPassAuth = false;
var jwtExpTime = 24*60*60; // 24h

exports.setByPassAuth =  function (pIsBypassAuth)
{
    byPassAuth = pIsBypassAuth;
}

exports.setJwtExpTime =  function (pJwtExpTime)
{
    jwtExpTime = pJwtExpTime;
}

exports.isByPassAuth =  function ()
{
    return byPassAuth;
}

exports.getJwtExpTime =  function ()
{
    return jwtExpTime;
}

