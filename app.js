var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
 next();
});

app.use(cors());

app.get("/ping", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/json"});
    res.end();
});

app.get("/", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/json"});
    res.end();
});

app.post("/", function (req, res) {
try {
 if(req.body.payload) {
    if (Array.isArray(req.body.payload)) {
     var results = [];
     var resultaddressTerms = req.body.payload.filter(function(indvaddress) {
           return (indvaddress.type === 'htv' && indvaddress.workflow === 'completed');
     });
    resultaddressTerms.map((indvaddress) => {
    var concatenatedAddress = indvaddress.address.buildingNumber+"  "+indvaddress.address.street+" "+indvaddress.address.suburb+" "+indvaddress.address.state+" "+indvaddress.address.postcode;
    results.push({
      concataddress: concatenatedAddress,
      type: 'htv',
      workflow: 'completed',
   });
   });
   res.json(results);
   } else {
    res.writeHead(400,{"ContentType":"text/html"});
    res.end("Incorrect format: JSON payload is not array");
   }
} else {
   res.writeHead(400,{"ContentType":"text/html"});
   res.end("Incorrect format: JSON missing payload key");
      }
 } catch (e) {
   console.error(e);
   res.writeHead(400,{"ContentType":"text/html"});
   res.end("Could not decode request: JSON parsing failed");
      }
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

app.on("error",function(error){
   if (error.syscall !== 'listen') {
     throw error;
 }

   switch (error.code) {
   case 'EACCES':
    console.error('Requires elevated privileges');
    process.exit(1);
    break;
   case 'EADDRINUSE':
    console.error('Address/Port is already in use');
    process.exit(1);
    break;
   default:
    throw error;
   };
})

module.exports = app;
