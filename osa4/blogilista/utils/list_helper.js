const dummy = (blogs) => {
    return 1  
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0) 
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    let favorite = blogs[0]

    blogs.forEach(blog => {
        if (blog.likes > favorite.likes) {
            favorite = blog
        }
    })

    return favorite
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog
}