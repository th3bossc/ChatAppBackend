const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');



const validateToken = expressAsyncHandler( async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error('User is not authorized');
            }
            if (decoded.user)
                req.user = decoded.user;
            else    
                req.guest = decoded.guest;
            next();
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid token / User not authorized');
    }
});

module.exports = validateToken;