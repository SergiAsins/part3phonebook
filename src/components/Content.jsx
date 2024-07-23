import React from 'react'
import Person from './person'

const Content = ({ persons, deletePerson }) => (
  <ul>
    {persons.map((person, i) => 
      <Person key={i} person={person} deletePerson={deletePerson} />
    )}
  </ul>
)

export default Content

