const mongoose = require('mongoose')

/*
Quizes: [
  {
    name: Quiz1
    questions: [
      {
        name: "Question name"
        questionList: [],
        correctAnswer: Number
      },
      {
        name: "Question name"
        questionList: [],
        correctAnswer: Number
      },
    ]
  },
]
*/

function arrayLimit(val) {
  return val.length > 0
}

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  answersList: {
    type: [String],
    validate: [arrayLimit, '{PATH} must have one item'],
  },
  correctAnswer: { type: Number, required: true },
})

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questions: {
      type: [questionSchema],
      validate: [arrayLimit, '{PATH} must have one item'],
    },
  },
  { collection: 'Quizzes' }
)

quizSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  },
})

questionSchema.set('toJSON', {
  transform: (doc, obj) => {
    delete obj._id
  },
})

const Quiz = new mongoose.model('Quiz', quizSchema)

module.exports = Quiz
