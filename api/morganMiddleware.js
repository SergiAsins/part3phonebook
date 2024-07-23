const morgan = require('morgan')
const fs = require('fs')
const path = require('path');

//creating a personalized token which logs the body of the petition 
morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : '';
});

//creating an stream for logging in a file:
const logStream = fs.createWriteStream(path.join(__dirname, 'acces.log'), {flags: 'a'})

//configure morgan with customized format:
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms:body', {
    stream: logStream //records the file
});

module.exports = morganMiddleware;