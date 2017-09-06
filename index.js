// Setup basic express server
let express = require('express');
let app = express();
let path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;
let bodyParser = require('body-parser');
let mongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/gsocidb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let generateUniqueID = () => {
    "use strict";
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
};

// Chatroom
let rooms = [];

let numUsers = 0;

let scktConn = (socket, namespace) => {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        console.log(namespace + " new message: " + data);
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
};


let addRoomToDb = (room, res) => {
    "use strict";
    mongoClient.connect(url, (err, db) => {
        if (err) {
            res.status(500).json({error: err});
        }
        else {
            db.collection('rooms')
                .insertOne(room, (err, ret) => {
                    if (err) {
                        res.status(500).json({error: err});
                    }
                    db.close();
                    room.namespace = io.of('/chatrooms/' + room._id);
                    room.namespace.on('connection', (socket) => {
                        scktConn(socket, room._id);
                    });
                    rooms.push(room);
                    res.status(200)
                        .json({
                            _id: room._id,
                            userId: room.userId,
                            username: room.username,
                            query: room.query,
                        });
                });
        }
    });
};

let removeRoomFromDb = (room, res) => {
    mongoClient.connect(url, (err, db) => {
        "use strict";
        if (err) {
            res.status(500).json({error: err});
        }
        db.collection('rooms')
            .removeOne(room, (err, ret) => {
                if (err) {
                    res.status(500).json({error: err});
                }
                db.close();
                res.status(200).json(ret);
            });
    });
};


// Routing
/**
 * The /new/chatroom POST method, is for the android app to call.
 * A new chatroom will be created for a Live Help session.
 * The following info needs to be sent as Content-Type
 * `application/x-www-form-urlencoded`
 * -> username
 * -> question
 *
 * The method will create a new chatroom and send the access URL back to the app for Socket Connection
 *
 */
app.post('/new/chatroom', (req, res) => {
    "use strict";
    let body = req.body;
    console.log(body);
    let room = {
        _id: generateUniqueID(),
        userId: body.userId,
        username: body.username,
        query: body.query
    };
    rooms.push(room);
    addRoomToDb(room, res);
});

/**
 * Will probably change this to delete when the room count gets to zero
 * For now, make a call to this method with the body containing the room Object in JSON Encoding.
 */
app.post('/delete/chatroom', (req, res) => {
    "use strict";
    let room = req.body;
    let roomId = -1;
    if (rooms.find((obj, idx) => {
            if (obj._id === room._id) {
                roomId = idx;
                return obj._id === room._id;
            }
            return false;
        })) {
        // Remove from the rooms array
        rooms.splice(roomId, 1);
        // Remove from database
        removeRoomFromDb(room, res);
    } else {
        res.status(404).json({error: "Does not exist"});
    }
});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
