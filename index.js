const express = require('express')
const app = express()
app.use(express.json());

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]
const generateId = () => {
    const minId = 1;
    const maxId = 1000000; // Choose a sufficiently large range
    return Math.floor(Math.random() * (maxId - minId + 1) + minId);
};
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const person = {
        // Generate a unique ID
        id: generateId(),
        name: body.name,
        number: body.number

    };

    persons = persons.concat(person);

    response.json(person);
});



app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === String(id)); // Ensure id comparison is with a string
    if (person) {
        response.json(person);
    } else {
        console.log('x');
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    const currentTime = new Date();
    const infoMessage = `Phonebook has info for ${persons.length} people`;

    response.send(`<p>${infoMessage}</p><p>${currentTime}</p>`);
});
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== String(id)); // Ensure id comparison is with a string

    response.status(204).end();
});

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
