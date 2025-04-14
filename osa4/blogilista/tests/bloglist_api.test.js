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
    
    const expectedBlogCount = 26
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

test('likes is set to 0 if not specified', async () => {
    const newBlog = {
        title: 'Blog without likes',
        author: 'No Likes Guy',
        url: 'http://example.com/nolikes'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    if (savedBlog.likes !== 0) {
        throw new Error(`Expected likes to default to 0, got ${savedBlog.likes}`)
    }
    
})

test('blog without title is not added and returns 400', async () => {
    const initialResponse = await api.get('/api/blogs')
    const initialCount = initialResponse.body.length

    const newBlog = {
        author: 'No Name Guy',
        url: 'http://nourl.com',
        likes: 1
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const responseAfter = await api.get('/api/blogs')
    const finalCount = responseAfter.body.length

    if (finalCount !== initialCount) {
        throw new Error('Blog without title was incorrectly added to the database')
    }
})

test('blog without url is not added and returns 400', async () => {
    const initialResponse = await api.get('/api/blogs')
    const initialCount = initialResponse.body.length

    const newBlog = {
        title: 'Blog Without Url',
        author: 'No Name Guy',
        likes: 8
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const responseAfter = await api.get('/api/blogs')
    const finalCount = responseAfter.body.length

    if (finalCount !== initialCount) {
        throw new Error('Blog without url was incorrectly added to the database')
    }
})

test('delete blog', async () => {
    const newBlog = {
        title: 'Blog to be deleted',
        author: 'Author to be deleted',
        url: 'http://urltoberemoved.com',
        likes: 2
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogToDelete = response.body

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const responseAfter = await api.get('/api/blogs')
    const ids = responseAfter.body.map(blog => blog.id)

    if (ids.includes(blogToDelete.id)) {
        throw new Error('Blog was not deleted')
    }
})

after(async () => {
    await mongoose.connection.close()
  })