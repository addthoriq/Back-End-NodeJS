const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = (pageCount === readPage)

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  let response = ''
  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
  } else if (readPage > pageCount) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
  } else if (!year || !author || !summary || !publisher || !pageCount || !readPage) {
    response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
  } else {
    books.push(newBook)
    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
  }

  return response
}

const getAllBookHandler = (request, h) => {
  const nilai = request.query
  const isReadingQuery = request.query.reading
  const isFinishedQuery = request.query.finished
  let response = ''

  if (isReadingQuery === '1') {
    if (nilai.reading === '1') {
      response = h.response({
        status: 'success',
        data: {
          books: books.filter((b) => b.reading === true)
        }
      })
      response.code(200)
    } else {
      response = h.response({
        status: 'success',
        data: {
          books: books.filter((b) => b.reading === false)
        }
      })
      response.code(200)
    }
  } else if (isFinishedQuery === '1') {
    if (nilai.finished === '1') {
      response = h.response({
        status: 'success',
        data: {
          books: books.filter((b) => b.finished === true)
        }
      })
      response.code(200)
    } else {
      response = h.response({
        status: 'success',
        data: {
          books: books.filter((b) => b.finished === false)
        }
      })
      response.code(200)
    }
  } else {
    if (books !== null) {
      response = h.response({
        status: 'success',
        data: {
          books: books.map(book => {
            return { id: book.id, name: book.name, publisher: book.publisher }
          })
        }
      })
      response.code(200)
    } else {
      response = h.response({
        status: 'success',
        data: {
          books: []
        }
      })
      response.code(200)
    }
  }

  return response
}

const getDetailBookHandler = (request, h) => {
  const id = request.params

  const book = books.filter((book) => book.id === id.bookId)[0]

  let response = ''

  if (book !== undefined) {
    response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
  } else {
    response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
  }

  return response
}

const updateBookHandler = (request, h) => {
  const id = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const finished = (pageCount === readPage)
  const index = books.findIndex((book) => book.id === id.bookId)
  let response = ''
  if (index !== -1) {
    if (!name) {
      response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
    } else if (readPage > pageCount) {
      response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
    } else {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished
      }
      response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
    }
  } else {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
  }

  return response
}

const deleteBookHandler = (request, h) => {
  const id = request.params
  const index = books.findIndex((book) => book.id === id.bookId)
  let response = ''
  if (index !== -1) {
    books.splice(index, 1)
    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
  } else {
    response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
  }

  return response
}

module.exports = { addBookHandler, getAllBookHandler, getDetailBookHandler, updateBookHandler, deleteBookHandler }
