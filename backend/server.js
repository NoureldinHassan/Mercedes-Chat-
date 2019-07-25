const WebSocket = require('ws');
var Houndify = require('houndify');
const wss = new WebSocket.Server({ port: 3030 });
const https = require('https');



var lock_request = require('request');

var headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': 'Bearer a1b2c3d4-a1b2-a1b2-a1b2-a1b2c3d4e5f6'
};

var dataString = '{ "command": "LOCK"}';

var options = {
    url: 'https://api.mercedes-benz.com/experimental/connectedvehicle_tryout/v1/vehicles/1234567890ABCD1234/doors',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
	var is_locked = JSON.stringify(body);
    if (!error && response.statusCode == 200) {
		is_locked = JSON.parse(is_locked);
		is_locked = is_locked.replace('"status":','"car_status":');
		console.log(is_locked.car_status);
		if(is_locked.includes("INITIATED"))
		{
	    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
		const message = { name: "Mercedes", message: "The Car is Locked" }
        client.send(JSON.stringify(message));
      }
    });
    }
	}
}




wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
	  //Initialize TextRequest
	  console.log(data);
var textRequest = new Houndify.TextRequest({

  query: data,

  clientId:  "KheEqtCmCXp_B4KZwGHTgA==", 
  clientKey: "yhHEKE49HAGRYr-JNyGe2L761hBt8ucUVdZ8OgjUIc9VmTarjBQsmF_-g_hadlbPSY5L4X_xS3VbC2cOuQykhw==",

  //REQUEST INFO JSON
  //see https://houndify.com/reference/RequestInfo
  requestInfo: {
    UserID: "test_user",
    Latitude: 37.388309, 
    Longitude: -121.973968
  },

  onResponse: function(response, info) {
    var txt = JSON.stringify(response.AllResults[0].Result);
	txt = JSON.parse(txt);

	if (txt.CAR){
		if(txt.CAR == "lock")
		{
	lock_request(options, callback); // send the lock request to mercedes 
	  
	}	

	}
  },

  onError: function(err, info) {
    console.log(err);
	    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

});

  });
});