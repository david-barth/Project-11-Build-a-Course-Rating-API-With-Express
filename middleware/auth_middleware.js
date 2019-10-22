const express = require('express');
const auth = require('basic-auth'); 
const User = require('../models/user'); 

function userAuth (req, res, next) {
    //Parse Credentials from Authorization Heade: 
    const authUser = auth.parse(req.get('Authorization')); 
    
    //Authentication of User: 
    User.authenticate(authUser.name, authUser.pass, function(err, user) {
        if (err || !user) {
            let err = new Error('Wrong email or password used!'); 
            err.status = 401; 
            return next(err); 
        } 
            //Assign the authenticated user to the request object and proceed to the piece of middleware. 
            req.authUser = user; 
            return next();
    });
}







/* Requirements for the authentication middleware function 


1. Add a middleware function that attempts to get the user credentials from Authorization header set on the request.

2. You can use the basic-auth npm package to parse the `Authorization' header into the user's credentials.

3. Use the authenticate static method you built on the user schema to check the credentials against the database

4. If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.

5. If the authenticate method returns an error, then pass it to the next function




*/


module.exports = userAuth; 