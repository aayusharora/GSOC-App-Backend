
const express = require('express');
const bp = require('body-parser');
const api_v1 = require('./api_v1');

var app = express();
app.get('/', function(req,res) {

    res.send('Hello World');
});

app.use(bp.json());
app.use(bp.urlencoded({extended : true}));
app.use('/api_v1',api_v1);

app.listen( process.env.PORT || 5000 , function() {
    console.log("Serving running on Port " + PORT);
});

