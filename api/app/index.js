const express = require('express')
const bodyParser = require('body-parser')
const routes = require('../routes')
const { errorHandler } = require('../middleware')

const app = express()

app.use(bodyParser.json())
app.use(routes)
app.use(errorHandler)

module.exports = app
