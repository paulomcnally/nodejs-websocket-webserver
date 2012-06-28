/* ------------------------------------------
node.js v0.6.15 (http://nodejs.org/)
2012-04-10 13:05:32 -0600
Servidor web que recibe parametros por get y los envía mediante WebSocket al cliente.
@paulomcnally
------------------------------------------ */

/* ------------------------------------------
WebSocket
socket.io
http://socket.io
------------------------------------------ */

var WebSocket = require("socket.io").listen( 6969 );

WebSocket.sockets.on("connection", ws_start);

function ws_start(data)
	{
	data.on("new_message", ws_sendData);
	}

function ws_sendData(data)
	{
	WebSocket.sockets.emit("ws_getData",data);
	}



/* ------------------------------------------
WebServer
------------------------------------------ */ 
//var sys = require ('sys'),
var sys = require(process.binding('natives').util ? 'util' : 'sys'),
url = require('url'),
http = require('http'),
querystring = require('querystring');


http.createServer(function (req, res)
	{
	switch( req.method )
		{
		case 'GET':
			var GET = url.parse(req.url,true);
			if( GET.search != "" )
				{
				ws_sendData( GET.query );
				}
			console.log(GET.query);
		break;
		
		case 'POST':
			req.addListener('data', function(chunk)
    		{
     	   var POST = querystring.parse(chunk);
		   ws_sendData( POST );
     	   console.log(POST);
    		});
		break;
		}

	// Close load page
	res.writeHead(200, {'Content-Type': 'text/plain'});
  	
	res.end('{"status":true}\n');

	
	}).listen( 9391 );
