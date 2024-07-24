import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url';
import morganMiddleware from './morganMiddleware.js'; //it imports the middleware of morgan
import path from 'path'
import mongoose from 'mongoose'
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
// Use environment varibales

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
    console.error('Error: La variable de entorno MONGODB_URI no está definida');
    process.exit(1);
  }

// Define __filename and  __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//connect to MongoDB
;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', error.message));

//define the schema and model of MongoDB
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

const Person = mongoose.model('Person', personSchema);

const PORT = process.env.PORT || 3001

app.use(cors()); // enables Cross-Origin Resource Sharing
app.use(express.json()); // Enables the management of JSON data format in the petitions WITH Express middleware
app.use(morganMiddleware);// It uses the middleware of Morgan
app.use(express.static(path.join(__dirname, '../dist'))) // Serve static files from the 'dist' folder

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// Endpoints API
app.get('/api/persons', async (req, res) => {
    const persons = await Person.find({});
    res.json(persons);
  });

app.get('/info', async (req, res) => {
try {
    const numberOfPersons = await Person.countDocuments({});
    const currentDate = new Date();
    const info = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentDate}</p>
    `;
    res.send(info);
} catch (error) {
    res.status(500).send({ error: 'Error fetching information' });
}
});

  

app.get('/api/persons/:id', async (req, res) => {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: 'Person not found' });
    }
  });


app.delete('/api/persons/:id', async (req, res) => {
await Person.findByIdAndRemove(req.params.id);
res.status(204).end();
});

app.post('/api/persons', async (req, res) => {
const body = req.body;

if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
}

const nameExists = await Person.findOne({ name: body.name });
if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' });
}

const newPerson = new Person({
    name: body.name,
    number: body.number
});

const savedPerson = await newPerson.save();
res.json(savedPerson);
});

//Serve the frontend for any other routes not managed by the API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist'), 'index.html')
}) 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
