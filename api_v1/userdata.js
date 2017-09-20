/**
 * Created by aayusharora on 9/20/17.
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');
bodyParser.json();
bodyParser.urlencoded({ extended: true });


router.post('/createuser', function( req, res ){
     var userData = req.body.user;
     console.log(userData.isgsoc_mentor);
     db.actions.user.addUserInfo(userData, function(err, user) {
        if(err) {
           console.error(err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: "Could not add the batch(Internal Server Error)."
                }
            })
        }
        else {
            res.status(201).send({
                success: true,
                data: user.get()

            })
        }

     });
 });

module.exports = router;