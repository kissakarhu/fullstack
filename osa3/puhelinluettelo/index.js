const express = require('express')
const app = express()

app.use(express.json())

let numbers = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const generateId = () => {
    const maxId = numbers.length > 0
      ? Math.max(...numbers.map(n => Number(n.id)))
      : 0
    return maxId + 1
}

app.get('/api/persons', (request, response) => {
    response.json(numbers)
})

app.get('/info', (repuest, response) => {
    const time = new Date()
    response.send(`<p>Phonebook has info for for ${numbers.length} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = numbers.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    numbers = numbers.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            'error': 'name or number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    numbers.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

