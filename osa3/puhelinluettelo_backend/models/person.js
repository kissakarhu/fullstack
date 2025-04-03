const mongoose = require('mongoose')

//if (process.argv.length < 3) {
//    console.log('give password as an argument')
//    process.exit(1)
//}

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        response.json(result)
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`${name} saved to the phonebook!`)
        mongoose.connection.close()
    })
}

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)