var _window = $(window);
var _input = $('.inputMsg');
var _msgBox = $('.showMsg');

var username = 'click';

var socket = io();

function sendMsg(){
	var msg = _input.val();
	msg = cleanInput(msg);
	if(msg){
		_input.val('');
		addMsg({
			username:username,
			message:msg
		});
	}
	socket.emit('new message', msg);
}
function addMsg(data, options){
	options = options ||{};
	_msgBox.append($('<li>').text(data.message));
}
function cleanInput(input){
	return $('<div/>').text(input).text();
}

socket.on('new message', function(data) {
	addMsg(data);
});