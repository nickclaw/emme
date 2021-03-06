var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    async = require('async');
    expose = require('../index.js');

// create some models
var itemSchema = mongoose.Schema({
    text: {type: String, required: true},
    protectedText: {type: String, default: "You can't touch this!"},
    privateText: {type: String, default: "You can't see this..."}
});
var Item = mongoose.model('Item', itemSchema);



// setup express
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser()); // required
app.use('/static', express.static(path.join(__dirname, 'public')));

// expose item to /api/item path
app.use('/api/item', expose(Item, {
    protected: ['protectedText'],
    private: ['privateText', '__v'],

    methods: {
        create: {

        },

        retrieve: {

        },

        update: {

        },

        remove: {

        },

        browse: {

        }
    }
}));

app.use(function(req, res, next) {
    res.render('index');
});


// start
async.parallel([

    // start mongoose
    function(next) {
        mongoose.connect('mongodb://127.0.0.1/emexpose', function(err) {
            next(err);
        });
    },

    // start server
    function(next) {
        var server = app.listen(8080, function(err) {
            next(err);
        });
    }
], function(err) {
    if (err) return console.error(err);
    console.log('√ successfully running.');
});
