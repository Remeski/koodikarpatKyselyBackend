const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

require('./db')()

// Middleware
app.use(express.json())
app.use(cors())

// 3 endpoints, GET /quiz returns quizes names, GET /quiz/:name returns quiz by name, POST /quiz makes a new quiz

app.get('/', (req, res) => {
  res.send(
    'Shhh, be quiet. This backend needs absolute silence to work to its fullest potential'
  )
})

const Quiz = require('./Models/Quiz')

// GET /quiz - get Quizzes names
app.get('/quiz', (req, res) => {
  Quiz.find({})
    .select('name')
    .then(dbRes => {
      if (dbRes.length < 1) {
        return res.status(404).json({ error: 'No quizzes found' })
      }
      res.status(200).json(dbRes)
    })
})

// GET /quiz/:quizName - get Quiz by name
app.get('/quiz/:name', (req, res) => {
  const { name } = req.params
  Quiz.find({ name })
    .then(dbRes => {
      if (dbRes.length < 1) {
        return res.status(404).json({ error: 'Quiz not found' })
      }
      res.json(dbRes)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
})

// POST /quiz - create a quiz
app.post('/quiz', (req, res) => {
  const { name, questions } = req.body

  const quizModel = new Quiz({
    name,
    questions: questions.map(question => ({
      name: question.name,
      answersList: question.answersList,
      correctAnswer: question.correctAnswer,
    })),
  })

  quizModel
    .save()
    .then(dbRes => {
      res.status(201).end()
    })
    .catch(err => {
      if (err.message.startsWith('E11000')) {
        return res.status(400).json({ error: err.message })
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
      }
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
