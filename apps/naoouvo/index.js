#!/bin/env node
var express = require('express');
var fs      = require('fs');
var path = require('path');
var request = require('sync-request');

var naoouvo = express();
var count = 0;

var getFeed = function(){
	apiGoogle = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=9999999&q=";
    site = "http://feeds.feedburner.com/naoouvo";
    var resa = request('GET', apiGoogle+site);
    feed = JSON.parse(resa.getBody()).responseData.feed;
    return feed.entries;
}

naoouvo.get('/feed', function (req, res) {
    res.set({'Content-Type': 'application/json'});
    feed = getFeed();
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

    for(i = feed.length - 1; i >= 0; i--){
    	podcast = {}
    	podcast["title"] = feed[i]["title"];
    	podcast["link"] = feed[i]["link"];
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
    	podcasts["teoria"][i]["img"] = "/res/naoouvo/img/teoria/" + ++i + ".jpg";
    }
    for(i in podcasts.musical){
        podcasts["musical"][i]["id"] = parseInt(i);
    	podcasts["musical"][i]["img"] = "/res/naoouvo/img/musical/" + ++i + ".jpg";
    }
    for(i in podcasts.cartinha){
        podcasts["cartinha"][i]["id"] = parseInt(i);
    	podcasts["cartinha"][i]["img"] = "/res/naoouvo/img/cartinha/" + ++i + ".jpg";
    }
    for(i in podcasts.visita){
        podcasts["visita"][i]["id"] = parseInt(i);
    	podcasts["visita"][i]["img"] = "/res/naoouvo/img/visita/" + ++i + ".jpg";
    }
    for(i in podcasts.plantao){
        podcasts["plantao"][i]["id"] = parseInt(i);
    	podcasts["plantao"][i]["img"] = "/res/naoouvo/img/plantao/" + ++i + ".jpg";
    }
    for(i in podcasts.naoouvo){
        podcasts["naoouvo"][i]["id"] = parseInt(i);
    	podcasts["naoouvo"][i]["img"] = "/res/naoouvo/img/naoouvo/" + ++i + ".jpg";
    }
    for(i in podcasts.outros){
        podcasts["outros"][i]["id"] = parseInt(i);
    	podcasts["outros"][i]["img"] = "/res/naoouvo/img/outros/1.jpg";
    }

    count = feed.length;
    podcasts["num"] = count;
    res.json(podcasts);  
});

naoouvo.get('/', function (req, res) {  
  res.sendfile('./static/naoouvo/index.html');
});

module.exports = naoouvo;

