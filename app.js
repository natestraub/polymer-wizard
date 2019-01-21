/*eslint-env node */
var express = require("express");
var bodyParser = require("body-parser");
var https = require("https");
var app = express();
var cfenv = require("cfenv");

function GetCode(instanceId, clientReq) {
	 var body = [];
 	 var request = https.request({
						hostname: "bpmpc.blue20.com",
						port : 9443,
						path: "/rest/bpm/wle/v1/process/" + instanceId + "?parts=header%7Cdata",
						auth: "",
						method: "GET",
            rejectUnauthorized: false
						},
           function (response) {
             console.log("STATUS: " + response.statusCode);
             console.log("HEADERS: " + JSON.stringify(response.headers));
             //response.setEncoding("utf8");
             response.on("data", function (chunk) {
               //piid = chunk.body.data.piid;
               //console.log('PIID: ' + piid);
               body.push(chunk);
             }).on("end", function() {
      			    body = Buffer.concat(body).toString();
      			    var obj = JSON.parse(body);
      			    clientRes.send(obj.data.variables);
    			   });
        });
    
	  	request.on("error", function(e) {
  			console.log("problem with request: " + e.message);
	   	});
  request.write("");
  request.end();
}

app.use(express.static(__dirname + "/"));

app.use(bodyParser.json()); // support json encoded bodies

app.get("/data", function(req, res) {
    console.log(req.query.piid);
    var instanceId = req.query.piid;
    GetCode(instanceid, res);
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
