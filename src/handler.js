/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
let books = require('./books');

// eslint-disable-next-line consistent-return
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// eslint-disable-next-line consistent-return
const getAllBooksHandler = (request) => {
  // eslint-disable-next-line global-require
  books = require('./books');

  const { name, reading, finished } = request.query;

  if (name) {
    books = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    books = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return {
      status: 'success',
      name,
      data: {
        books,
      },
    };
  }

  if (reading) {
    if (reading == 0) {
      books = books.filter((book) => book.reading === false);
      books = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
      return {
        status: 'success',
        name,
        reading,
        data: {
          books,
        },
      };
    }

    if (reading == 1) {
      books = books.filter((book) => book.reading === true);
      books = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
      return {
        status: 'success',
        name,
        reading,
        data: {
          books,
        },
      };
    }
  }

  if (finished) {
    if (finished == 0) {
      books = books.filter((book) => book.finished === false);
      books = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
      return {
        status: 'success',
        name,
        finished,
        data: {
          books,
        },
      };
    }

    if (finished == 1) {
      books = books.filter((book) => book.finished === true);
      books = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
      return {
        status: 'success',
        name,
        finished,
        data: {
          books,
        },
      };
    }
  }

  if (books.length > 0) {
    books = books.map((book) => ({
      name: book.name,
      id: book.id,
      publisher: book.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  // eslint-disable-next-line global-require
  books = require('./books');
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getAllBooksByName = (request) => {
  const { name = 'dicoding' } = request.params;
  books = books.filter((book) => book.name === name);
  return {
    status: 'successi',
    data: {
      books,
    },
  };
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  getAllBooksByName,
};
