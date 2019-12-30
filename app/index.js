const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('../routes')
const { errorHandler } = require('../middleware')

const app = express()

// TODO: Configure production logging format
let loggerFormat = 'dev'
if (process.env.NODE_ENV === 'test') {
  loggerFormat = () => null
}
app.use(morgan(loggerFormat))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(routes)
app.use(errorHandler)

module.exports = app
