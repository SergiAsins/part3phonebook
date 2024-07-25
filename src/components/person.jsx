import React from 'react'

//handleDelete aavns era personDelete
const Person = ({ person, handleDelete }) => (
  <li>
   {person.name} {person.number}
  <button onClick={() => handleDelete(person.id)}> delete </button>
  </li>
)

export default Person
