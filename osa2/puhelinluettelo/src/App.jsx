import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Filter = ({ filter, onChange }) => {
  return (
    <div>Filter shown with: 
      <input value={filter} onChange={onChange}/>
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: 
        <input 
          value={newName}
          onChange={onNameChange}/>
      </div>
      <div>
        number: 
        <input
          value={newNumber}
          onChange={onNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
      </form>
  )
}

const Persons = ({ contacts, handleDelete }) => {
  return (
    <ul>
      {contacts.map(contact => (
        <Person 
          key={contact.id} 
          name={contact.name} 
          number={contact.number} 
          onDelete={() => handleDelete(contact.id)} 
        />
      ))}
    </ul>
  )
}

const Person = ({ name, number, onDelete }) => {
  return (
    <li>
      {name} {number}
      <button onClick={onDelete}>delete</button>
    </li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    personsService
      .getAll()
        .then(initialNumbers => {
          setPersons(initialNumbers)
        })
  }, [])

  const contactsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addName = (event) => {
    event.preventDefault()
    const found = persons.find(({ name }) => name === newName)

    if (found) {
      window.alert(`${newName} is already added to the phonebook`)
    } else {
      const numberObject = { name: newName, number: newNumber }
      personsService
        .addNewNumber(numberObject)
          .then(returnedNumber => {
            setPersons(persons.concat(returnedNumber))
            setNewName('')
            setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShowAll(event.target.value === '')
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?")
    if (confirmed) {
      personsService
        .deleteNumber(id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== id))
          })
          .catch(error => {
            console.error(`Poisto epäonnistui: ${error}`)
            }
          )
    }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add new contact</h2>
      <PersonForm
        onSubmit={addName}
        newName={newName} 
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons contacts={contactsToShow} handleDelete={handleDelete}/>
    </>
  )

}

export default App