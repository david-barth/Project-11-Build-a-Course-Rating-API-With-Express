//Routes file. 

const express = require('express');
const User = require('../models/user');
const Review = require('../models/review');
const Course = require('../models/course');
const auth = require('../middleware/auth_middleware');
const router = express.Router();


//Param() method settig for :courseId 

router.param('courseId', (req, res, next, courseId) => {
    Course.findById(courseId).populate('user').populate('reviews').exec(function(err, course) {
        if (err) {
            return next(err); 
        } else if (!course) {
            err = new Error('No course found.'); 
            err.status = 404; 
            return next(err); 
        }
        req.course = course; 
        return next(); 
    })
});

//Purpose: Uses a courseId from the route parameter to find a course.  

    //The course properties of 'user' and 'review' are populated and the course is attached to the request body. 
    //The course is now made available to other routes. 




//GET Route for returning currently authenticated user. 

router.get('/users', auth, (req, res, next) => {
    res.json(req.authUser);
});

//Purpose: After user is found and authenticated by the auth middleware, the authenticated user is returned as JSON to the client. 



//User POST Route: 

router.post('/users', (req, res, next) => {
    res.setHeader('Location', '/')
    const newUser = new User(req.body);
     newUser.save((err, newUser) => {
        if (err) {
            if (err.name.includes('ValidationError')) {
                err.status = 400; 
            }
            return next(err); 
        } else {
            res.status(201); 
            res.json(newUser);
        };
    });
});

//Purpose: A user is created from the User model and the user is saved to the database, returning a 201 code to the user and the user info to the client via JSON. 




//GET courses (all courses)

router.get('/courses', (req, res, next) => {
    Course.find({}, null, {sort: {title: -1}}, (err, courses) => {
        if (err) {
            return next(err);
        } else {
            res.status(200);
            let courseInfo = []; 
            for (i = 0; i < courses.length; i++) {
                let course = {
                    id: courses[i]._id, 
                    title: courses[i].title
                }
                courseInfo.push(course);
            }
            res.json(courseInfo);
        }
    });
});

//Purpose: Finds all courses and returns an array of all course ids and titles.  





//GET course (1 course): 

router.get('/courses/:courseId', (req, res) => {
    res.json(req.course);  
});

//Purpose: Returns the course specified in the route parameter. 




//POST courses: 

router.post('/courses', auth, (req, res, next) => {
   res.setHeader('Location', '/')
   const newCourse = new Course({
       title: req.body.title, 
       description: req.body.description, 
       estimatedTime: '60 years', 
       user: req.authUser,
       steps: req.body.steps, 
   }); 
   newCourse.save((err, newCourse) => {
    if (err) {
        if (err.name.includes('ValidationError')) {
            err.status = 400; 
        }
        return next(err); 
    } else {
        res.status(201); 
        res.json(newCourse);
    };
});
});

//Purpose: Instantiates a new course after the user has been authenticated.  User information is matched onto the course instance. 



// PUT Route to Update Course: 


router.put('/courses/:courseId', auth, (req, res, next) => {
    let course = req.course; 
    let update = req.body; 
    course.updateOne(update, {runValidators: true}, (err, newCourse) => {
        if (err) {
            if (err.name.includes('ValidationError')) {
                err.status = 400; 
            }
            return next(err)
        }
        else {
            res.json(newCourse); 
        }
    });
}); 

//Purpose: Updates the instance of the chosen course and returns the newly updated course in JSON. 




//POST  Route to create Reviews 

router.post('/courses/:courseId/reviews', auth, (req, res, next) => {
    res.setHeader('Location', '/courses/'+ req.course._id); 
    const newReview = new Review({
        user: req.authUser, 
        rating: req.body.rating, 
        review: req.body.review
    }); 
    newReview.save((err, review) => {
        if (err) {
            if (err.name.includes('ValidationError')) {
                err.status = 400; 
            }
            return next(err)
        }
        else {
            res.status(201);
            res.json(review);
        };
    }); 
});

//Purpose: Creates a new instance of a review, after the user has been authenticated and saves this review to the database. The user's information is matched to the review. 





//All errors, especially validation errors, are passed from the route handler to the global error handler in the index.js file.  




module.exports = router; 