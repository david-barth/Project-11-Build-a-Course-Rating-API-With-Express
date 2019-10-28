'use strict';

const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); 
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    fullName: {
        type: String, 
        required: true,
        trim: true
    }, 
    emailAddress: { 
        type: String,
        validate: {
            validator: (email) => {
                let regex = /\S+@\S+\.\S+/; 
                return regex.test(email);
            }, 
            message: props => props.value + ' is not a valid email'
        },
        required: true, 
        unique: true, 
        trim: true
    }, 
    password: {
        type: String, 
        required: true, 
        trim: true
    }
});


//User Authentication Static method 

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({emailAddress: email}, function (err, user) {
        if (err) {
            return callback(err); 
        } else if (!user) {
            err.status = 401; 
            return callback(err);
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (password === user.password) {
                return callback(null, user); 
            }           
             else {
                return callback(); 
            }
        });
    });
}; 

//Purpose: authenticate() accepts email, password, and a callback function.  
    //Email is used to retrieve a user from the database.  
    //Then passwords in the database and the entered password are compared.  
    //On a successful match, the user is returned, via callback. 



//Pre-Save Hook to Hash Password of User Document: 

UserSchema.pre('save',  function (next) {
    let user = this; 
    bcrypt.hash(user.password, 10, function (err, hashed) {
        if (err) {
            return next(err);
        } else {
            user.password = hashed; 
            next();
        };
    });
});

//Purpose: Pre-save hook is used to hash the password and add a salt to the password of the user when the model is instantiated.



//Creation of User Model: 

const User = mongoose.model('User', UserSchema); 


module.exports = User; 

