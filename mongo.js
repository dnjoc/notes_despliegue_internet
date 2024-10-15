const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://dnjoc:${password}@cluster0.1o0ya.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
  content: String,
  date: { type: Date, default: Date.now },
  important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)
/* const note = new Note({
   content: 'HTML is easy',
  content: 'CSS is hard',
   content: 'Mongoose makes things easy',
   date: new Date(),
   important: true,
 });
 note.save().then(result => {
   console.log('note saved!')
  mongoose.connection.close()
 })*/
Note.find({}).then((result) => {
  //Note.find({ important: true }).then(result => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
