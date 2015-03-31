# io-router

Easy routing for socket.io.
Inspired by express.io way of routing socket.io.

## How to use:

```javascript
var app = require('express')();
var io = require('socket.io');

var server = app.listen('8080', function () {
    io = io(server)

    require('io-router')(io);
  
    io.route('dummy', function (req) {
        console.log(req.data);
    });
    
    io.route('john', {
        doe: function (req) {
            req.io.route('foo:bar:baz');  
        }
    });
    
    io.route('foo', {
        bar: {
            baz: function (req) {
                req.io.route('dummy')
            }
        }
    });

    io.on('connection', function (socket) {
        io.router.init(socket);
    });
});
```
