const express = require('express');
const router = express.Router();

const BookController = require('../Controllers/book');

router.get('/', BookController.getAllBooks);

router.get('/:id', BookController.getBookById);

router.post('/', BookController.addNewBook);

router.put('/:id', BookController.updateBook);

router.delete('/:id', BookController.deleteBookById);

module.exports = router;
