var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
	Book.find({}, 'title author')
		.populate('author')
		.exec((err, list_books) => {
			if (err) {
				return next(err);
			}
			// console.log(list_books);
			// Successful, so render
			res.render('book_list', {
				title: 'Book List',
				book_list: list_books
			});
			// console.log(book_list);
		});
};

// Display detail page for a specific book
exports.book_detail = (req, res, next) => {
	async.parallel(
		{
			book: callback => {
				Book.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			book_instance: callback => {
				BookInstance.find({ book: req.params.id }).exec(callback);
			}
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.book == null) {
				var err = new Error('Book not found');
				err.status = 404;
				return next(err);
			}

			//Successful, therefore, render
			res.render('book_detail', {
				title: 'Title',
				book: results.book,
				book_instances: results.book_instance
			});
		}
	);
};

// Display book create form on GET
exports.book_create_get = (req, res, next) => {
	// Get all authors and genres, which we can use for adding to our book
	async.parallel(
		{
			authors: callback => Author.find(callback),
			genres: callback => Genre.find(callback)
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			res.render('book_form', {
				title: 'Create Book',
				authors: results.authors,
				genres: results.genres
			});
		}
	);
};

// Handle book create on POST
exports.book_create_post = [
	// Convert the genre into an array
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === 'undefined') req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	// Validate fields
	body('title', 'Title must not be empty')
		.isLength({ min: 1 })
		.trim(),
	body('author', 'Author must not be empty')
		.isLength({ min: 1 })
		.trim(),
	body('summary', 'Summary must not be empty')
		.isLength({ min: 1 })
		.trim(),
	body('isbn', 'ISBN must not be empty')
		.isLength({ min: 1 })
		.trim(),

	// Sanitize fields (using wildcard)
	sanitizeBody('*')
		.trim()
		.escape(),

	//Process the request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var book = new Book({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre
		});

		if (!errors.isEmpty()) {
			// There are errors. Re-render form with sanitized values/ error messages

			// Get all authors and genres for form.
			async.parallel(
				{
					authors: callback => Author.find(callback),
					genres: callback => Genres.find(callback)
				},
				(err, results) => {
					if (err) {
						return next(err);
					}

					// Mark selected genres as checked
					for (i in results.genres) {
						if (book.genre.indexOf(results.genres[i]._id) > -1) {
							results.genres[i].checked = 'true';
						}
					}
					res.render('book_form', {
						title: 'Create Book',
						authors: results.authors,
						genres: results.genres,
						book,
						errors: errors.array()
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Save book.
			book.save(err => {
				if (err) {
					return next(err);
				}
				// Successful - redirect to new book record.
				res.redirect(book.url);
			});
		}
	}
];

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
