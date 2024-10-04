const express = require('express')
const app = express()

require('dotenv').config()

const Note = require('./models/note')

const cors = require('cors')

app.use(cors())
//agregamos el middleware integrado de Express llamado static
app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
//Configuracion de mongodb atlas

//const password = process.argv[2]
// const url =
//   `mongodb+srv://dnjoc:${password}@cluster0.1o0ya.mongodb.net/noteApp?retryWrites=true&w=majority`

//const Note = mongoose.model('Note', noteSchema)
//const Note = require('./models/note')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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
  app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
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
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.use(unknownEndpoint)
  
  //const PORT = process.env.PORT || 3001
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
