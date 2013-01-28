/* ------------------------------------------
Mongodb
------------------------------------------ */ 
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/test');

var schema = mongoose.Schema({ number: 'string', text: 'string', id: 'string' });

var Sms = db.model('Sms', schema);

var Message = db.model('Sms'); 

/*


kitty.save(function (err) {
  if (err) {
		console.log(err);
	}
  console.log( kitty );
});

console.log( Message.find({name:'Zildjian'}) );
*/






/* ------------------------------------------
WebApp
------------------------------------------ */
var express = require('express');
var fs      = require('fs');
var views   = require('./models/views');

var app = express();

var html = "";

/* Create public directory */
app.use(express.static(__dirname + '/public'))

/* Load index page */
app.get('/', function(req, res){

	var html = "";

	html = views.load('index.html',fs);

	var query = Message.find({},function(err, records){
		if(err ){
			
		}
		else{
			if( records.length != 0 ){
				html = html.replace('@json_data', JSON.stringify( records ) );
			}
			else{
				html = html.replace('@json_data', '[{"number":"82749763","text":"Envia tus preguntas al 82749763","id":"c3a4a581e9acd930ff81615cf32ae26c"}]' );
			}

			
		}

    	res.writeHead(200, {'Content-Type' : 'text/html'});
    	res.end( html );
  	});

    
});

/* Load about page */
app.get('/about', function(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end( views.load('about.html',fs) );
});

app.listen(80);


/* ------------------------------------------
WebSocket
socket.io
http://socket.io
------------------------------------------ */

var WebSocket = require("socket.io").listen( 8081 );

WebSocket.sockets.on("connection", ws_start);

function ws_start(data){
	data.on("new_message", ws_sendData);
}

function ws_sendData(data){
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
var crypto = require('crypto');


http.createServer(function (req, res){
	switch( req.method ){
		case 'GET':
			var GET = url.parse(req.url,true);
			if( GET.search != "" ){
				GET.query.id = crypto.createHash('md5').update(new Date().toISOString()).digest("hex");

				var sms_data = new Sms( GET.query );

				sms_data.save(function (err) {
  					if (err) {
						console.log(err);
					}
  				console.log( sms_data );
				});

				ws_sendData( GET.query );
			}
			console.log(GET.query);
		break;
	}

	// Close load page
	res.writeHead(200, {'Content-Type': 'text/plain'});
  	
	res.end('Success');
	
}).listen( 8082 );



/* ------------------------------------------
IP
------------------------------------------ */ 
var os = require('os')

var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

console.log(addresses)



app.get('/:id', function (req, res){
	var query = Message.find({ id: req.params.id }).remove();

	res.redirect('/');
  
});



