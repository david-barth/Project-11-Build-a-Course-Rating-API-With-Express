'use strict';

//Course Model

const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 


const CourseSchema = new Schema({
    user: {  
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    title: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }, 
    estimatedTime: String, 
    steps: [{
        stepNumber: Number, 
        title: {
            type: String, 
            required: true 
        },
        description: {
            type: String,
            required: true
        }
    }],  
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]  
});

//User and Review Models are referenced by ObjectIds. 

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course; 