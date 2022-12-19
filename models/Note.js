const { Schema, model } = require('mongoose')

const notesScheme = new Schema(
  {
    content: {
      type: String,
      require: true
    },
    date: {
      type: Date
    },
    important: {
      type: Boolean
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  })

notesScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Notes = model('Notes', notesScheme)

module.exports = Notes
