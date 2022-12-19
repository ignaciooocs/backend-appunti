const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true
    },
    name: {
      type: String,
      require: true
    },
    passwordHash: {
      type: String,
      require: true
    },
    notes: [{
      type: Schema.Types.ObjectId,
      ref: 'Notes'
    }]
  })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash)
}

// userSchema.pre('save', async function (next) {
//   const user = this
//   if (!user.isModified('passwordHash')) return next()
//   try {
//     const saltRounds = await bcrypt.genSalt(10)
//     user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds)
//     next()
//   } catch (error) {
//     console.log(error)
//     throw new Error('fallo el hash de contraseña')
//   }
// })

const User = model('User', userSchema)

module.exports = User
