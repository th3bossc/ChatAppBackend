const moment = require('moment');

const logger = (req, res, next) => {
    //console.log('Hello'); //can be used to run any function when the get request is called 
    console.log(`[${req.method}] ${req.originalUrl}: (${moment()})`);
    next(); 
};


module.exports = logger;