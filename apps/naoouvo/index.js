#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');
var request = require('sync-request');

var naoouvo = express(); 

naoouvo.get('/feed', function (req, res) {
    res.set({'Content-Type': 'application/json'});
    apiGoogle = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=9999999&q=";
    site = "http://feeds.feedburner.com/naoouvo";
    var resa = request('GET', apiGoogle+site);
    feed = JSON.parse(resa.getBody()).responseData.feed;
    res.json(feed);  
});

naoouvo.get('/', function (req, res) {  
  res.sendfile('./static/naoouvo/index.html');
});

module.exports = naoouvo;