import React from 'react'

const successStyle = {
  color: 'blue',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const errorStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const style = message.includes('ERROR') ? errorStyle : successStyle

  return (
    <div style={style} className="error">
      {message}
    </div>
  )
}

export default Notification
