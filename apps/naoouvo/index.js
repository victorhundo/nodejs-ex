#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');
var request = require('sync-request');

var naoouvo = express();
var count = 0;
var delayFunction = 300000; //5min
var feed = undefined;

var getFeed = function(){
   feed = myFeed();
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
    feed = JSON.parse(html.getBody()).query.results.body.rss.channel.image.info.thumbnail.category;
    feed = feed[feed.length - 1].category.category;
    feed = feed[feed.length - 1].category.category;
    return feed.item;
}

var myFeed = function(){
    var myFeed = getData();
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
        podcast["title"] = myFeed[i]["content"];
        podcast["subtitle"] = myFeed[i]["subtitle"]["summary"];
        podcast["link"] = myFeed[i]["subtitle"]["image"]["enclosure"]["url"];
        podcast["img"] = myFeed[i]["subtitle"]["image"]["href"];
        var check = podcast["title"].split('-')[0];
        
        if(check.match("Teoria")){
            podcast["categoria"] = "teoria";
            podcasts.teoria.push(podcast);
        }
            
        else if (check.match("Musical")){
            podcast["categoria"] = "musical";
            podcasts.musical.push(podcast);
        }       
        else if (check.match("Cartinha")){
            podcast["categoria"] = "cartinha";
            podcasts.cartinha.push(podcast);
        }
        else if (check.match("Visita")){
            podcast["categoria"] = "visita";
            podcasts.visita.push(podcast);
        }
        else if (check.match("Plantão")){
            podcast["categoria"] = "plantao";
            podcasts.plantao.push(podcast);
        }
        else if (check.match("Extra")){
            podcast["categoria"] = "extra";
            podcasts.outros.push(podcast);
        }
        else if (!check.match("Não Ouvo")){
            podcast["categoria"] = "outros";
            podcasts.outros.push(podcast);
        }
        else{
            podcast["categoria"] = "naoouvo";
            podcasts.naoouvo.push(podcast);
        }
        
        podcasts.todos.push(podcast);
    }


    for(i in podcasts.teoria){
        podcasts["teoria"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.musical){
        podcasts["musical"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.cartinha){
        podcasts["cartinha"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.visita){
        podcasts["visita"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.plantao){
        podcasts["plantao"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.naoouvo){
        podcasts["naoouvo"][i]["id"] = parseInt(i);
    }
    for(i in podcasts.outros){
        podcasts["outros"][i]["id"] = parseInt(i);
    }

    count = myFeed.length;
    podcasts["num"] = count;
    return podcasts;
}

module.exports = naoouvo;

