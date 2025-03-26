import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  const contactsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addName = (event) => {
    event.preventDefault()
    const found = persons.find(({ name }) => name === newName)

    if (found) {
      window.alert(`${newName} is already added to the phonebook`)
    } else {
      const contactObject = { name: newName, number: newNumber }
      setPersons(persons.concat(contactObject))
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

  return (
    <div>
      <h2>Phonebook</h2>
      <div>Filter shown with: 
        <input
          value={filter}
          onChange={handleFilterChange}/>
      </div>
      <h2>Add new contact</h2>
      <form onSubmit={addName}>
        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}/>
        <div>number: 
          <input
            value={newNumber}
            onChange={handleNumberChange}/>
        </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {contactsToShow.map(person =>
          <p key={person.name}>{person.name} {person.number}</p>
         )}
      </ul>
    </div>
  )

}

export default App