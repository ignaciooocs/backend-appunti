const mongoose = require('mongoose')

const connectionString = process.env.DATA_BASE_URI

mongoose.connect(connectionString)
  .then(() => {
    console.log('dataBase connected')
  }).catch(() => {
    console.log('ocurrio un error')
  })
