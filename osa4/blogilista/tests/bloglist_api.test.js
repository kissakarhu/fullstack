const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('GET returns correct amount of blogs as JSON', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const expectedBlogCount = 6
    if (response.body.length !== expectedBlogCount) {
        throw new Error(`Expected ${expectedBlogCount} blogs, got ${response.body.length}`)
    }
})

after(async () => {
    await mongoose.connection.close()
  })