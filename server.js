
const express = require('express');
const bp = require('body-parser');
const api_v1 = require('./api_v1');

var app = express();

var PORT =  process.env.port || 5000 ;

app.get('/', function(req,res) {

    res.send('Hello World');
});

app.use(bp.json());
app.use(bp.urlencoded({extended : true}));
app.use('/api_v1',api_v1);

app.listen( PORT, function() {
    console.log("Serving running on Port " + PORT);
});

