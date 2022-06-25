// Node server which will handle our socket.io connections

const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

const users = {};

// Listening to every server instance
io.on('connection', socket => {

    // If any new users joins, we notify every other user
    socket.on('new-user-joined', user_name => {
        users[socket.id] = user_name;
        socket.broadcast.emit('user-joined', user_name);
    });

    // If someones sends a message, broadcast it to every other user
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, user_name: users[socket.id] });
    });

    // If someones leaves the chat, notify every other user
    // disconnect is built in event
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})