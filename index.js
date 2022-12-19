require('dotenv').config()
require('./mongo')
const cors = require('cors')
const express = require('express')
const app = express()
const notesRouter = require('./controllers/notes.js')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Middleware
app.use(express.json())
app.use(cors())

// Request
app.get('/', (req, res) => {
  res.send('Bienvenido a la api de notas')
})

// Routes
app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// Middleware
app.use((error, req, res, next) => {
  if (error.name === 'CastError') {
    res.status(404).end()
  }
})

// Port
const port = process.env.PORT
app.listen(port, () => {
  console.log('running')
})
