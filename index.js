const express = require('express')
const app = express()

require('dotenv').config()
const Note = require('./models/note')
//agregamos el middleware integrado de Express llamado static
app.use(express.static('dist'))
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
//Configuracion de mongodb atlas

//const password = process.argv[2]
// const url =
//   `mongodb+srv://dnjoc:${password}@cluster0.1o0ya.mongodb.net/noteApp?retryWrites=true&w=majority`

//const Note = mongoose.model('Note', noteSchema)
//const Note = require('./models/note')
// const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => n.id))
//       : 0
//     return maxId + 1
//   }
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//configuracion get para consulta en mongodb
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

// app.get('/api/notes/:id', (request, response) => {

//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)
//   if (note) {
//       response.json(note)
//     } else {
//       response.status(404).end()
//     }
// })

//usando el metodo findById de mongoose
app.get('/api/notes/:id', (request, response, next) => {
  console.log(request.params.id)
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  // .catch(error => {
  //   console.log(error)
  //   //response.status(500).end()
  //   response.status(400).send({ error: 'malformatted id' })
  //})
})

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }

//   const note = {
//     content: body.content,
//     important: Boolean(body.important) || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

//Configuracion para crear una nueva nota en mogodb
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

//configuracion para actualizar la importancia de una nota en mongodb
app.put('/api/notes/:id', (request, response, next) => {
  // const body = request.body
  const { content, important } = request.body
  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }

  // Note.findByIdAndUpdate(request.params.id, note, { new: true })
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })
//Configuracion para eliminar una nota en mongoDB
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)
//const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
