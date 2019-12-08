const express = require('express')
const request = require('supertest')
const up = require('./')

const testApp = express()
testApp.use(up)

describe('GET /', () => {
  test('sends a success response', () => {
    return request(testApp)
      .get('/')
      .expect(200, '👍')
  })
})
