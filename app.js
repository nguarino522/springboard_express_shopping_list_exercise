const express = require('express');
const app = express();
const itemRoutes = require('./routes/items.js')
const ExpressError = require('./expressError');
const morgan = require('morgan');


app.use(morgan('dev'));
app.use(express.json());
app.use('/items', itemRoutes);

app.get('/', (req, res) => {
    return res.send('<h1>Simple Shopping List JSON API application!</h1>');
});

// 404 error handler
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

// general error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
        error: err
    });
});

module.exports = app;