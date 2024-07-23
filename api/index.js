const express = require('express')
const cors = require('cors')
import morganMiddleware from 'morganMiddleware.js'; //it imports the middleware of morgan
const path = require ('path')
const app = express();


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

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req,res) => {
    const numberOfPersons = persons.length;
    const currentDate = new Date ();
    const info =`
        <p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentDate}</p>
    `;
    res.send(info);
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if(person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found'});
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const initialLength = persons.length;
    persons = persons.filter(person => person.id !== id);

    if (persons.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return res.status(400).json ({ error: 'Name must be unique' });
    }

    const id = Math.floor(Math.random() * 10000);
    const newPerson = {
        id: id,
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});

//Serve the frontend for any other routes not managed by the API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist'), 'index.html')
}) 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
