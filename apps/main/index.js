#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');

var main = express(); 

main.get('/', function (req, res) {  
  res.sendfile('./static/main/index.html');
});

module.exports = main;