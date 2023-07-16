const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();

const server = require('http').Server(app);
const userRoute = require('./routes/userRoutes');
const roomRoute = require('./routes/roomRoutes');

const io = require('socket.io')(server);

const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();


app.use(cors({origin : '*'}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/room', roomRoute);
app.use(errorHandler);


io.on('connection', (socket) => {
    socket.on('initiate', async (username) => {
        socket.username = username;
        socket.currentRoom = null;
        await prisma.user.update({
            where : { username : username },
            data : {
                online : true,
            }
        });
        io.to(socket.id).emit('initiation-complete');
    })
    socket.on('join-room', async (newRoomId) => {
        if (socket.currentRoom) {
            socket.leave(socket.currentRoom)
            io.to(socket.currentRoom).emit('user-disconnected', socket.username);
        }
        const newRoom = await prisma.room.findUnique({ where : { id : newRoomId } });
        if (!newRoom) {
            io.to(socket.id).emit('room-deleted');
        }
        socket.currentRoom = newRoomId;
        await prisma.room.update({
            where : { id : newRoomId },
            data : {
                users : {
                    connect : {username : socket.username}
                }
            },
            
        });
        socket.join(newRoomId); 
        io.to(socket.id).emit('joined-room-successfully');
        io.to(newRoomId).emit('user-connected')
    });
    socket.on('new-message', async (content) => {
        const newMessage = await prisma.message.create({
            data : {
                content : content,
                sender : {
                    connect : { username : socket.username}
                },
                room : {
                    connect : {id : socket.currentRoom},
                }
            },
        });
        io.to(socket.currentRoom).emit('incoming-message');
    });
    socket.on('delete-room', async () => {
        const currentRoom = await prisma.room.findUnique({ where : { id : socket.currentRoom } });
        if (currentRoom) {
            io.to(socket.currentRoom).emit('current-room-deleted');
            io.socketsLeave(currentRoom.id);
            await prisma.room.delete({ where : { id : socket.currentRoom } });
        }
    });
    socket.on('disconnect', async () => {
        if (socket.currentRoom) {
            io.to(socket.currentRoom).emit('user-disconnected');
        }
        if (socket.username) {
            await prisma.user.update({
                where : { username : socket.username },
                data : {
                    online : false,
                }
            });
        }

    })
})

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));