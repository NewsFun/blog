/**
 * Created by bobo on 2016/8/4.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1203; 

app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname+'/index.html');
});
var userNum = 0;
io.on('connection', function (socket) {
	var addedUser = false;
	socket.on('add user', function (username) {
		if (addedUser) return;
		socket.username = username;
		++userNum;
		socket.emit('login',{
			userNum:userNum
		});

		socket.broadcast.emit('user joined', {
			username:socket.username,
			userNum:userNum
		});
	});

	socket.on('new message', function(data) {
		socket.broadcast.emit('new message', {
			username:socket.username,
			message:data
		});
	});

	socket.on('disconnect', function() {
		if(addedUser){
			--userNum;
			socket.broadcast.emit('user left', {
				username:socket.username,
				userNum:userNum
			});
		}
	});
});

http.listen(port, function(){
	console.log('listening on port %d', port);
});