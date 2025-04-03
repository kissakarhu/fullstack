require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    return Math.floor(Math.random() * 1000000).toString()
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    const time = new Date()
    Person.countDocuments({})
        .then(count => {
            response.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
        })


    response.send(`<p>Phonebook has info for for ${numbers.length} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.deleteOne({ _id: request.params.id })
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            'error': 'name or number missing'
        })
    }

    const found = numbers.find(person => person.name === body.name)

    if (found) {
        return response.status(400).json({
            'error': 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
    })
    
    person.save()
        .then(result => response.json(result))
        .catch(() => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

