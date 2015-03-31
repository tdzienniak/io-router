var extend = require('node.extend');

function Request(io, request) {
	this.io = io;
	this.request = request;
	this.socket = request.socket;
}

extend(Request.prototype, {
	broadcast: function (event, message) {
		this.socket.broadcast.emit(event, message);
	},
	route: function (name) {
		this.io.route(name, this.request, {
			trigger: true
		});
	}
});

module.exports = Request;
