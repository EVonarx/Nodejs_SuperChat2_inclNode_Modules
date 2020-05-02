var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'); // block HTML characters (security equivalent to htmlentities in PHP)

// load index.html file.
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // As soon as we are given a nickname, we store it as a session variable and inform other people
    socket.on('new_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', pseudo);
    });

    // As soon as we receive a message, we retrieve the nickname of its author and we transmit it to other people
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

server.listen(8080);
