// const bcript = require('bcrypt')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'El nombre de usuario o contraseña son incorrectos' })
    }

    const respuestaPassword = await user.comparePassword(password)
    if (!respuestaPassword) {
      return res.status(401).json({ error: 'El nombre de usuario o contraseña son incorrectos' })
    }

    const userForToken = {
      id: user.id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res.send({
      username: user.username,
      name: user.name,
      id: user.id,
      token
    })
  } catch (error) {
    console.log('ocurrio un error')
  }
})

module.exports = loginRouter
