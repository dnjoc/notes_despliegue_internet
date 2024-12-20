const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)



//codigo anterior

//se importa mongoose
// const mongoose = require('mongoose')
// //Configuracion de mongodb atlas
// mongoose.set('strictQuery', false)

// const url = process.env.MONGODB_URI
// console.log('connecting to', url)

// mongoose.connect(url)
//   .then(result => {
//     console.log(result)
//     console.log('connected to MongoDB')
//   })
//   .catch(error => {
//     console.log('error connecting to MongoDB:', error.message)
//   })
// const noteSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     minLength: 5,
//     required: true
//   },
//   date: { type: Date, default: Date.now },
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })
// module.exports = mongoose.model('Note', noteSchema)