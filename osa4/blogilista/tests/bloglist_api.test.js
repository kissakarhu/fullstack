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
    
    const expectedBlogCount = 16
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

test('a new blog can be added with POST request', async () => {
    const initialResponse = await api.get('/api/blogs')
    const initialBlogs = initialResponse.body

    const newBlog = {
        title: 'Uusi blogi',
        author: 'Testaaja',
        url: 'http://example.com/testi',
        likes: 8
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const responseAfter = await api.get('/api/blogs')
    const blogsAfter = responseAfter.body

    if (blogsAfter.length !== initialBlogs.length + 1) {
        throw new Error('Blog count did not grow as expected')
    }
    
    const titles = blogsAfter.map(blog => blog.title)
    if (!titles.includes(newBlog.title)) {
        throw new Error('New blog cannot be found from the bloglist')
    }

})

after(async () => {
    await mongoose.connection.close()
  })