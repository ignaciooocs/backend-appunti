const mongoose = require('mongoose')

const connectionString = process.env.DATA_BASE_URI

const connect = async () => {
  try {
    await mongoose.connect(connectionString)
    console.log('dataBase Connected')
  } catch (error) {
    console.log(error)
  }
}

connect()

// mongoose.connect(connectionString)
//   .then(() => {
//     console.log('dataBase connected')
//   }).catch(() => {
//     console.log('ocurrio un error')
//   })
