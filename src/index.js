var is = require('check-types');
var debug = require('debug')('io-router');
var Request = require('./request');

module.exports = function (io, options) {
    'use strict';

    var routes = {};

    if (is.not.object(options)) {
        options = {};
    }

    function route (name, thing, options) {
        if (is.not.unemptyString(name)) {
            debug('route name should be an unempty string');
            return;
        }

        if (is.not.object(options)) {
            options = {};
        }

        if (options.trigger) {
            if (!(name in routes)) {
                debug('can\'t forward - route %s doesn\'t exist', name);
                return;
            }

            routes[name](thing);

            return;
        }

        if (is.object(thing)) {
            for (var routeName in thing) {
                route(name + ':' + routeName, thing[routeName])
            }

            return;
        }

        if (is.not.function(thing)) {
            debug('you must provide callback to register route');

            return;
        }

        routes[name] = thing;

        return;
    }

    function init(socket) {
        Object.keys(routes).forEach(function (name) {
            var callback = routes[name];

            socket.on(name, function (data, respond) {
                if (is.function(data)) {
                    respond = data;
                    data = undefined;
                }

                var request = {
                    data: data,
                    socket: socket,
                    session: socket.handshake.session,
                    sessionID: socket.handshake.sessionID,
                    headers: socket.handshake.headers,
                    cookies: socket.handshake.cookies,
                    respond: (is.function(respond)) ? respond : function () {}
                };
                
                request.io = new Request(io, request);

                return callback(request);
            });
        });
    }

    if (options.initOnConnection) {
        io.on('connection', function (socket) {
            init(socket);
        });
    }

    //setting up router on socket.io instance
    io.router = {
        init: init,
        route: route
    };

    io.route = route;

    return io.router;
}
