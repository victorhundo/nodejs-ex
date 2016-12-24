#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');
var redis = require('redis');
var requestProxy = require('express-request-proxy');
var main = require('./apps/main')
var naoouvo = require('./apps/naoouvo');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

// Main application.
var app = express();

// Seting static files path
app.use('/res',  express.static(__dirname + '/static/'));

//Allow Cross
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Mouting applications.
app.use('/', main);
app.use('/naoouvo', naoouvo);

// Start listening.
app.listen(server_port, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});
