var express = require('express');
const dbconnection = require('src/dbconnecti.js')
var app = express();

// ARBITRARY COMMENT FOR TEST
app.get('/',  (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {-=
    console.log('Example app listening on port 3000!');
});
