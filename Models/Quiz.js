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

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  answersList: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: { type: Number, required: true },
})

questionSchema.set('toJSON', {
  transform: (doc, obj) => {
    delete obj._id
  },
})

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questions: [questionSchema],
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

const Quiz = new mongoose.model('Quiz', quizSchema)

module.exports = Quiz
