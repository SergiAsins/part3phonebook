import morgan from 'morgan';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//creating a personalized token which logs the body of the petition 
morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : '';
});

//creating an stream for logging in a file:
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

//configure morgan with customized format:
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms:body', {
    stream: logStream //records the file
});

export default morganMiddleware;;