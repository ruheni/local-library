var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
	Genre.find()
		.sort([['name', 'ascending']])
		.exec((err, genre_list) => {
			if (err) {
				next(err);
			}

			res.render('genre_list', {
				title: 'Genre List',
				genre_list
			});
		});
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
	var id = mongoose.Types.ObjectId(req.params.id);

	async.parallel(
		{
			genre: callback => {
				Genre.findById(req.params.id).exec(callback);
			},

			genre_books: callback => {
				Book.findById({
					genre: req.params.id
				}).exec(callback);
			}
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				// No results
				let err = new Error('Genre not found');
				err.status = 404;
				return next(err);
			}
			//Sucessfull, so render
			res.render('genre_detail', {
				title: 'Genre Detail',
				genre: results.genre,
				genre_books: results.genre_books
			});
		}
	);
};

// Display Genre create form on get
exports.genre_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST
exports.genre_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET
exports.genre_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update POST');
};
