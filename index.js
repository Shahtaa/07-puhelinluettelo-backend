const express = require('express');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(express.json()); // JSON body parser

// Custom token to log request body data for HTTP POST requests
morgan.token('postData', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body); // Convert request body to JSON string
    }
    return ''; // Return empty string for non-POST requests
});

// Logging with Morgan, including request body for POST requests
app.use(morgan(':method :url :status :response-time ms - :postData'));

// Data
let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Helper function to generate unique ID
const generateId = () => {
    const minId = 1;
    const maxId = 1000000;
    return Math.floor(Math.random() * (maxId - minId + 1) + minId);
};

// Routes
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);

    res.status(201).json(person); // Resource created successfully
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end(); // No content to send
});

app.get('/info', (req, res) => {
    const currentTime = new Date();
    const infoMessage = `Phonebook has info for ${persons.length} people`;
    res.send(`<p>${infoMessage}</p><p>${currentTime}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
