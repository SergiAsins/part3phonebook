import { useState, useEffect } from 'react';
import Content from './components/Content'
import Filter from './components/TempFilter' 
import Notification from './components/Notification'
import PersonForm from './components/TempPersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [allPersons, setAllPersons] = useState([])
  const [newName, setNewName ] = useState('')
  const [newNumber, setNewNumber ] = useState('')
  const [newFilter, setNewFilter] = useState ('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setAllPersons(initialPersons)
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = allPersons.find(person => person.name === newName)

    if (person) {
      const updatedPerson = { ...person, number: newNumber }

      if (window.confirm(`${person.name} is already in phonebook, replace the old number with a new one?`)) {
        personService
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setAllPersons(allPersons.map(personItem => personItem.id !== person.id ? personItem : returnedPerson))
            setPersons(allPersons.map(personItem => personItem.id !== person.id ? personItem : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`${updatedPerson.name} was successfully updated`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setAllPersons(allPersons.filter(person => person.id !== updatedPerson.id))
            setPersons(allPersons.filter(person => person.id !== updatedPerson.id))
            setMessage(`[ERROR] ${updatedPerson.name} was already deleted from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setAllPersons(allPersons.concat(returnedPerson))
          setPersons(allPersons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`${newName} was successfully added`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`[ERROR] ${error.response.data.error}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = allPersons.find(person => person.id === id)
    if (person && window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setAllPersons(allPersons.filter(person => person.id !== id))
          setPersons(allPersons.filter(person => person.id !== id))
          setMessage(`${person.name} was successfully deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`[ERROR] ${person.name} could not be deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
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
    const filter = event.target.value
    setNewFilter(filter)
    const regex = new RegExp(filter, 'i')
    const filteredPersons = allPersons.filter(person => person.name.match(regex))
    setPersons(filteredPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add new person</h2>
      <PersonForm onSubmit={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Content persons={persons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
