var flat = require('flat'),
    mongoose = require('mongoose'),
    express = require('express');

module.exports = {
    _router = express.Router();

    /**
     * Expose a mongoose model
     * @param {Model} model
     * @param {Object?} options
     * @param {String?} options.path    subpath this module is exposed under
     * @param {Array|Object?} options.private    paths that aren't exposed
     * @param {Array|Object?} options.protected    paths that aren't editable
     * @param {Function?} options.validate    validate data before applying to doc
     */
    expose: function(model, options) {
        options.path = options.path || model.modelName.toLowerCase();

        options.caseSensitive = options.caseSensitive || false;
        options.strict = options.strict || false;
        options.private = options.private || [];
        options.protected = options.protected || [];
        options.validate = options.validate || noop;

        this._router.use(options.path, buildRouter(model, options));
    },


    /**
     * Allow em-expose to be used by express `app.use()`
     * @return {Router} express middleware
     */
    middleware: function() {
        return this._router;
    }
}

/**
 * Builds a CRUD router for a model
 * @param {Model} model
 * @param {Object?} options same as expose function
 */
function buildRouter(model, options) {
    var router = express.Router({
            strict: options.strict,
            caseSensitive: options.caseSensitive
        }),
        select = options.private.join(' -');

    router

        /**
         * Search for documents
         */
        .get('/', function(req, res, next) {

        })

        /**
         * Create a document
         */
        .post('/', function(req, res, next) {

        })
        .route('/:id')

            /**
             * Intercept the call and find the document
             */
            .all(function(req, res, next) {
                model.findById(req.params.id, select, function(err, doc) {
                    if (err) return next(err);
                    if (!doc) return next(new Error('uhoh'));
                    req._doc = doc;
                    next();
                });
            })

            /**
             * Retrieve a document
             */
            .get(function(req, res, next) {
                return req._doc.toObject();
            })

            /**
             * Update a document
             */
            .put(function(req, res, next) {
                req._doc.update(req.body, function(err, doc) {
                    if (err) return next(err);
                    res.send(doc);
                });
            })

            /**
             * Delete a document
             */
            .delete(function(req, res, next) {
                req._doc.remove(function(err, doc) {
                    if (err) return next(err);
                    res.send(doc);
                });
            });

    return router;
}

/**
 * Noooooooope...
 * with support for async Nooooooooope...
 */
function noop(){
    var next = arguments[arguments.length - 1];
    return typeof next === 'function' ? next() : true;
};