#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');
var request = require('sync-request');
var Find = require('find-key');

var naoouvo = express();
var count = 0;
var delayFunction = 300000; //5min
var feed = undefined;

var getFeed = function(){
   feed = getData();
}
setInterval(getFeed, delayFunction);

naoouvo.get('/', function (req, res) {  
  res.sendfile('./static/naoouvo/index.html');
});

naoouvo.get('/feed', function (req, res) {
    res.set({'Content-Type': 'application/json'});
    if (feed == undefined)
        getFeed();
    res.json(feed);  
});

var getData = function(){
    //select * from html where url="http://feeds.feedburner.com/naoouvo"
    query = "select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ffeeds.feedburner.com%2Fnaoouvo%22%20&format=json&diagnostics=true&callback=";
    yahoo = "https://query.yahooapis.com/v1/public/yql?q=";
    yql = yahoo + query;

    var html = request('GET', yql);
    var bruteFeed = JSON.parse(html.getBody());
    bruteFeed = Find(bruteFeed, 'category')[0]
    bruteFeed = bruteFeed[bruteFeed.length - 1].category.category[1];
    brutefeed = Find(bruteFeed, 'item')[0];
    return myFeed(brutefeed);
}

var myFeed = function(myFeed){
    podcasts = {
        title: "Não Ouvo",
        num: count,
        todos: [],
        naoouvo: [],
        teoria:[],
        musical: [],
        cartinha: [],
        visita: [],
        plantao: [],
        outros: []
    };

    for(i = myFeed.length - 1; i >= 0; i--){
        podcast = {}
        podcast["title"]    =      Find(myFeed[i], 'content')[1];
        podcast["subtitle"] =      Find(myFeed[i], 'summary')[0];
        podcast["link"]     =      Find(myFeed[i], 'url')[0];
        podcast["img"]      =      Find(myFeed[i], 'href')[0];
        var check = podcast["title"].split('-')[0];

        var todos = JSON.parse(JSON.stringify(podcast));
        todos["id"] = podcasts.todos.length;
        podcasts.todos.push(todos);
        
        if(check.match("Teoria")){
            podcast["id"] = podcasts.teoria.length;
            podcasts.teoria.push(podcast);
        }
            
        else if (check.match("Musical")){
            podcast["id"] = podcasts.musical.length;
            podcasts.musical.push(podcast);
        }       
        else if (check.match("Cartinha")){
            podcast["id"] = podcasts.cartinha.length;
            podcasts.cartinha.push(podcast);
        }
        else if (check.match("Visita")){
            podcast["id"] = podcasts.visita.length;
            podcasts.visita.push(podcast);
        }
        else if (check.match("Plantão")){
            podcast["id"] = podcasts.plantao.length;
            podcasts.plantao.push(podcast);
        }
        else if (check.match("Extra")){
            podcast["id"] = podcasts.outros.length;
            podcasts.outros.push(podcast);
        }
        else if (!check.match("Não Ouvo")){
            podcast["id"] = podcasts.outros.length;
            podcasts.outros.push(podcast);
        }
        else{
            podcast["id"] = podcasts.naoouvo.length;
            podcasts.naoouvo.push(podcast);
        }
    }

    count = myFeed.length;
    podcasts["num"] = count;
    return podcasts;
}


var getKey = function(obj, key){
    if (Object.keys(obj).indexOf(key) >= 0)
        return obj[key];
    else{
        for(i = 0; i < Object.keys(obj).length; i++){
            if( typeof(obj[Object.keys(obj)[i]]) == 'object'){
                a = getKey(obj[Object.keys(obj)[i]], key);
                console.log(i);
                return a;
            }
                
        }
    }

    return "null";
}

module.exports = naoouvo;

