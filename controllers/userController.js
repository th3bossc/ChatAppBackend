const expressAsyncHandler = require('express-async-handler');
const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');


const registerHandler = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username, !password) {
        res.status(400);
        throw new Error('all fields are mandatory');
    }
    const userAvailable = await prisma.user.findUnique({ where : { username } });
    if (userAvailable) {
        res.status(400);
        throw new Error('Username already exists');
    }
    const hashed_password = await bcrypt.hash(password, 16);
    
    const newUser = await prisma.user.create({
        data : {
            username,
            password : hashed_password,
            rooms : {},
        }
    });
    
    if (newUser)
        res.status(201).json({_id : newUser.id, username : newUser.username});
    else {
        res.status(400);
        throw new Error('User Details Invalid');
    }

});

const loginHandler = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        throw new Error('all fields mandatory');
    }
    console.log('access user started');
    const user = await prisma.user.findUnique({ where : { username } });
    console.log('access user ended');
    if (!user) {
        res.status(400);
        throw new Error("User doesn't exist");
    }

    if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user : {
                    username : user.username,
                    id : user.id,
                },
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "1d"}
        );
        res.status(200).json({accessToken, rooms : user.rooms});
    }
    else {
        res.status(401);
        throw new Error('Username or Password not valid');
    }
});

const guestHandler = expressAsyncHandler(async (req, res) => {
    const id = randomUUID();
    const username = `Guest${id}`;
    const accessToken = jwt.sign(
        {
            guest : {
                username,
                id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : "1d" }
    );
    res.status(200).json(accessToken);
})


const currentHandler = expressAsyncHandler(async (req, res) => {
    res.status(200).json({username : req.user.username});
});

const onlineHandler = expressAsyncHandler(async (req, res) => {
    res.status(200).json({online : true});
});

module.exports = { loginHandler, registerHandler, currentHandler, onlineHandler };