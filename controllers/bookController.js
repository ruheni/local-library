var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

exports.index = (req, res, next) => {
    async.parallel(
        {
            // Pass empty object as match condition to find all
            // the documents of this collections
            book_count: callback => {
                Book.countDocuments({}, callback);
            },
            book_instance_count: callback => {
                BookInstance.countDocuments({}, callback);
            },
            book_instance_available_count: callback => {
                BookInstance.countDocuments({ status: 'Available' }, callback);
            },
            author_count: callback => {
                Author.countDocuments({}, callback);
            },
            genre_count: callback => {
                Genre.countDocuments({}, callback);
            }
        },
        function(err, results) {
            res.render('index', {
                title: 'Local Library Home',
                error: err,
                data: results
            });
        }
    );
};

// Display list of all books
exports.book_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific book
exports.book_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
};

// Display book create form on GET
exports.book_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST
exports.book_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET
exports.book_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.book_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update POST');
};
