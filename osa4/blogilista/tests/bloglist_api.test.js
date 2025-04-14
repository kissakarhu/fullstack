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

test('blogs have id field, not _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body

    blogs.forEach(blog => {
        if (!blog.id) {
            throw new Error('Blog is missing id field')
        }
        if (blog._id) {
            throw new Error('Blog should not contain _id field')
        }
    })
        
    
})

after(async () => {
    await mongoose.connection.close()
  })