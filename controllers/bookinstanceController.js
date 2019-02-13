var BookInstance = require('../models/bookinstance');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Book = require('../models/book');

// Display list of all BookInstances
exports.bookinstance_list = (req, res, next) => {
	BookInstance.find()
		.populate('book')
		.exec(function(err, list_bookinstances) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render('bookinstance_list', {
				title: 'Book Instance List',
				bookinstance_list: list_bookinstances
			});
		});
};

//Display detail page for a specific BookInstance
exports.bookinstance_detail = (req, res, next) => {
	BookInstance.findById(req.params.id)
		.populate('book')
		.exec(function(err, bookinstance) {
			if (err) {
				return next(err);
			}
			if (bookinstance == null) {
				var err = new Error('Book copy not found');
				err.status = 404;
				return next(err);
			}

			// Successful, therefore, render
			res.render('bookinstance_detail', {
				title: 'Book',
				bookinstance
			});
		});
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = (req, res, next) => {
	Book.find({}, 'title').exec((err, books) => {
		if (err) {
			return next(err);
		}
		// Successful, so render
		res.render('bookinstance_form', {
			title: 'Create Book Instance',
			book_list: books
		});
	});
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = (req, res, next) => [
	// Validate fields
	body('book', 'Book must be specified')
		.isLength({ min: 1 })
		.trim(),
	body('imprint', 'Imprint must be specified')
		.isLength({ min: 1 })
		.trim(),
	body('due_back', 'Invalid date')
		.optional({ checkFalsy: true })
		.isISO8601(),

	// Sanitize fields
	sanitizeBody('body')
		.trim()
		.escape(),
	sanitizeBody('imprint')
		.trim()
		.escape(),
	sanitizeBody('status')
		.trim()
		.escape(),
	sanitizeBody('due_back').toDate(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		// Create a Book Instance object with escaped and trimmed data
		var bookinstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back
		});

		if (!errors.isEmpty()) {
			// There are errors. Re-render form again with sanitized values and error messages.
			Book.find({}, 'title').exec((err, books) => {
				if (err) {
					return next(err);
				}
				// successful, therefore, render
				res.render('bookintance_form', {
					title: 'Create Book Instance',
					book_list: books,
					selected_book: bookinstance.book._id,
					errors: errors.array(),
					bookinstance
				});
			});
			return;
		} else {
			// Data in form is valid
			bookinstance.save(err => {
				if (err) {
					return next(err);
				}
				// Successful, therefore redirect to new record.
				res.redirect(bookinstance.url);
			});
		}
	}
];

// Display BookInstance delete on GET
exports.bookinstance_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance delete on GET');
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance delete on POST');
};

// Display BookInstance update on GET
exports.bookinstance_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance update on GET');
};

// Handle BookInstance update on POST
exports.bookinstance_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance update on POST');
};
