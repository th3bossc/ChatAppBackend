const { v4 : uuid} = require('uuid');
const expressAsyncHandler = require('express-async-handler');
const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

const newRoomHandler = expressAsyncHandler(async (req, res) => {
    const { newRoomName } = req.body;
    if (!newRoomName) {
        res.status(400);
        throw new Error('room name required');
    }
    
    const roomAvailable = await prisma.room.findUnique({
        where : {name : newRoomName}
    });
    
    if (roomAvailable) {
        res.status(400);
        throw new Error('Room name already taken, please choose a new one');
    }
    
    const newRoom = await prisma.room.create({
        data : {
            name : newRoomName, 
            messages : {},
            users : {},
        }
    });
    res.status(201).json({
        username : req.user.username,
        roomId : newRoom.id
    })
});


const joinRoomHandler = expressAsyncHandler(async (req, res) => {
    const roomName = req.params.room;
    const roomAvailable = await prisma.room.findUnique({
        where : {name : roomName}
    });
    if (!roomAvailable) {
        res.status(400);
        throw new Error("Room you're trying to join doesn't exist");
    }
    res.status(200).json({
        username : req.user.usename,
        roomId : roomAvailable.id
    })
})

const getUsersHandler = expressAsyncHandler(async (req, res) => {
    const currentRoom = await prisma.room.findUnique({
        where : {
            id : req.params.room,
        },
        select : {
            users : {
                select : {
                    username : true, online : true,
                }
            }
        }
    })

    if (!currentRoom) {
        res.status(400);
        throw new Error("Room doesn't exist");
    }

    res.status(200).json({
        usersList : currentRoom.users,
    });
});

const getRoomsHandler = expressAsyncHandler(async (req, res) => {
    const currentUser = await prisma.user.findUnique({
        where : {
            username : req.params.username,
        },
        select : {
            rooms : {
                select : {
                    id : true,
                    name : true,
                }
            }
        }
    })

    if (!currentUser) {
        res.status(400);
        throw new Error("User doesn't exist");
    }

    res.status(200).json({
        roomsList : currentUser.rooms,
    })
});

const deleteRoomHandler = expressAsyncHandler(async (req, res) => {
    const roomExists = await prisma.room.findUnique({
        where : {
            name : req.params.room
        }
    });
    if (!roomExists) {
        res.status(400);
        throw new Error('Room not found');
    }
    await prisma.room.delete({
        where : { name : req.params.room}
    });
    res.status(200).json({message : 'Room deteted successfully'});
});

const getMessagesHandler = expressAsyncHandler(async (req, res) => {
    const room = await prisma.room.findUnique({
        where : {
            id : req.params.room,
        },
        select : {
            messages : {
                select : {
                    time : true,
                    content : true,
                    sender : {
                        select : {
                            online : true,
                            username : true
                        }
                    }
                }
            }
        }
    })
    if (!room) {
        res.status(400);
        throw new Error('Room not found');
    }
    res.status(200).json({previousMessages : room.messages});
});


module.exports = { 
    newRoomHandler, 
    joinRoomHandler, 
    getUsersHandler, 
    getRoomsHandler, 
    deleteRoomHandler, 
    getMessagesHandler, 
};



