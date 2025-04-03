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

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
    })
    
    person.save()
        .then(result => response.json(result))
        .catch(() => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const updatedPerson = { name, number }

    Person.findByIdAndUpdate(
        request.params.id,
        updatedPerson,
        { new: true}
    )
    .then(updatedPerson => {
        if (!updatedPerson) {
            return response.status(404).json({ error: 'Person not found' })
        }
        response.json(updatedPerson)
    })
    .catch(error => next(error))
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

