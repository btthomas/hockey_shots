'use strict'
const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));

router.get('/', function(req, res){
    
  res.render('index');
});

module.exports = router;