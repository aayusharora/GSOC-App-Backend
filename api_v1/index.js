/**
 * Created by aayusharora on 9/20/17.
 */

const express = require('express');
const router = express.Router();

var userdata = require('./userdata');

router.use('/userdata', userdata);

module.exports = router;