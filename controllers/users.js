const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const requireToken = require('../middleware/requireToken')
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  res.json(users)
})

usersRouter.get('/:id', requireToken, async (req, res) => {
  const { id } = req.params
  const users = await User.findById(id).populate('notes', {
    content: 1,
    createdAt: 1,
    updatedAt: 1,
    important: 1
  })
  res.json(users)
})

usersRouter.delete('/:id', requireToken, async (req, res) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  res.status(204).end()
})

usersRouter.post('/', [
  body('password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
  body('name', 'El nombre debe tener minimo 3 caracteres').isLength({ min: 3 }),
  body('username', 'El nombre de usuario puede tener maximo 15 caracteres').isLength({ max: 15 }),
  body('username', 'El nombre de usuario debe tener minimo 4 caracteres').isLength({ min: 4 })
], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, name, password } = req.body

  try {
    let user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ error: 'Nombre de usuario ya existe', code: 11000 })
    }
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    user = new User({
      username,
      name,
      passwordHash
    })

    const saveUser = await user.save()

    res.json(saveUser)
  } catch (error) {
    console.log(error)
  }
})

module.exports = usersRouter
