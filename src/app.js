require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  console.log(apiToken)
  const authToken = req.get('Authorization')
  console.log(authToken)

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    //logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
  })

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

module.exports = app