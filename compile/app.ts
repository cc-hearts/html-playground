import express from 'express'
import bodyParser from 'body-parser'
import { traverseScriptCode } from './compile-script.js'
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Define a route
app.post('/', (req, res) => {
  const code = req.body
  const newCode = traverseScriptCode(code)
  res.json(newCode)
})

// Start the server
app.listen(30083, () => {
  console.log('Server is running on port 30083')
})
