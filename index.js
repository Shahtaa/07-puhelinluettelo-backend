const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Define a custom format for logging POST request data
morgan.token('postData', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return '';
});

// Middleware for logging requests
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postData');
app.use(requestLogger);

// Data
let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Helper function to generate unique ID
const generateId = () => {
    const minId = 1;
    const maxId = 1000;
    return Math.floor(Math.random() * (maxId - minId + 1) + minId);
};

// Routes

// Get all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Add a new person
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);

    res.status(201).json(person); // Resource created successfully
});

// Get person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    person ? res.json(person) : res.status(404).end();
});

// Delete person by ID
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end(); // No content to send
});

// Get info
app.get('/info', (req, res) => {
    const currentTime = new Date();
    const infoMessage = `Phonebook has info for ${persons.length} people`;
    res.send(`<p>${infoMessage}</p><p>${currentTime}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
