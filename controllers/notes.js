const notesRouter = require('express').Router()
const Notes = require('../models/Note')
const User = require('../models/User')
const requireToken = require('../middleware/requireToken')

notesRouter.get('/', async (req, res) => {
  const notes = await Notes.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

notesRouter.get('/:id', requireToken, async (req, res, next) => {
  const { id } = req.params

  const note = await Notes.findById(id).populate('user', {
    username: 1,
    name: 1
  })

  if (!note || !id) {
    res.status(400).end()
    return
  }
  res.json(note)
})

notesRouter.delete('/:id', requireToken, async (req, res, next) => {
  const { id } = req.params

  try {
    await Notes.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', requireToken, async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  if (!id || !note) {
    res.status(404).end()
    return
  }

  const noteUpdate = {
    content: note.content,
    important: note.important
  }

  try {
    const results = await Notes.findByIdAndUpdate(id, noteUpdate, { new: true })
    res.json(results)
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', requireToken, async (req, res, next) => {
  const { content, important = false } = req.body

  const { userId } = req
  const user = await User.findById(userId)

  const newNote = new Notes({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})
//   newNote.save().then(results => {
//     res.json(results)
//   }).catch(err => {
//     console.log(err)
//   })
// })

module.exports = notesRouter
