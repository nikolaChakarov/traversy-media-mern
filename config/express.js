const express = require('express');

function configExpress(app) {

    // Init Middleware
    app.use(express.json({ extended: false })); // body parser;

    // Define Routes
    app.use('/api/users', require('../routes/api/users'));
    app.use('/api/auth', require('../routes/api/auth'));
    app.use('/api/profile', require('../routes/api/profile'));
    app.use('/api/posts', require('../routes/api/posts'));

}

module.exports = configExpress;