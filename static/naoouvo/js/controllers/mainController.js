angular.module("naoouvo").controller("main", function($scope, $http, $window, $sce){

    var NaoOuvoFeed = "/naoouvo/feed";
    $scope.Npagination = 4;
    var count = 0;
    $http.get(NaoOuvoFeed).success(function(data) {
            $scope.feed = data;
            setCurrentFeed($scope.feed.todos, "Todos");
            setCurrentAudio($scope.currentFeed[0]);
            setExibition();
            
    });

    $scope.getImg = function(url){
       console.log(url);
    }

    $scope.onPlay = false;

    $scope.play = function(){
        $scope.feedOnPlay = $scope.currentFeed;
        var player = document.getElementById('player');
        player.addEventListener('ended', $scope.nextAudio);
        $scope.onPlay  = true;
        player.play();
    }

    $scope.pause = function(){
        $scope.onPlay  = false;
        var player = document.getElementById('player');
        player.pause();
    }

    $scope.trustSrc = function() {
        if ($scope.currentAudio == undefined)
            return "null";
        return $sce.trustAsResourceUrl($scope.currentAudio.link);
    }

    $scope.setAudio = function(audio){
        var player = document.getElementById('player');
        player.autoplay = true;
        setCurrentAudio(audio);
        $scope.play();
    }

    $scope.changeFeed = function(feed, title){
    	setCurrentFeed(feed, title);
    	setExibition();
    }

    var setCurrentAudio = function(audio){
        $scope.currentAudio = audio;
    }

    $scope.nextAudio = function(){
        var x = $scope.currentAudio.id + 1;
        var y = $scope.feedOnPlay.length
        var index = x - y * Math.floor(x / y);
        var audio = $scope.feedOnPlay[index];
       $scope.setAudio(audio);
       $scope.play();
    }

    var setCurrentFeed = function(feed, title){
    	count = 0;
    	$scope.feedTitle = title;
    	$scope.currentFeed = feed;
    	$scope.currentPod = count + 1;
    	$scope.nPod = feed.length;
    }

    var setExibition = function(){
    	var array = $scope.currentFeed;
    	var index = arrayMod(count, array.length);
    	
    	exibition = [];
    	for(i = 0; i < $scope.Npagination; i++){
    		if(i > array.length - 1)
    			break;
    		exibition.push(array[index[i]]);
    	}
    	$scope.exibition = exibition;
    	$scope.currentPod = index[0] + 1;

    }

    var arrayMod = function(x, y){
    	index = [];
    	for(i = 0; i < $scope.Npagination; i++){
    		index.push(x - y * Math.floor(x / y));
    		x++
    	}
    	return index;
    }

    $scope.nextPag = function(){
    	count++;
    	setExibition();
    }

    $scope.prevPag = function(){
    	count--;
    	setExibition();
    }

    $scope.getAudio = function(){
        return $scope.trustSrc($scope.exibition[0].link);
    }

    var updateSeek = function(){
        var player = document.getElementById("player");
        if (player == null){
            $scope.seek = 0
            $scope.duration = 0
        }
        else{
            $scope.now = player.currentTime
            $scope.duration = player.duration
            $scope.durationPorcent = (player.currentTime * 100 / player.duration).toFixed(2);
            var nowInt = Math.ceil( player.currentTime );
            var durationInt = Math.ceil(player.duration);
            $scope.clock = clockFormat(nowInt);
            $scope.clockDuration = clockFormat(durationInt);
        }
        
        $scope.$apply();
    }
    
    setInterval(updateSeek, 100);

    var clockFormat = function(sec){
        var t = new Date();
        t.setHours(0,0,0,0);
        if (!isNaN(sec))
            t.setSeconds(sec);
        return t
    }

    var updateProgressBar = function(e){
        $scope.barWidth = e.target.clientWidth;
    }


    $scope.handleProgressBarClick = function(e){
        var fullProgressBarWidth = e.target.clientWidth;
        $scope.requestedPosition = (e.layerX / fullProgressBarWidth * 100).toFixed(2);

        var player = document.getElementById("player");
        $scope.now = ($scope.requestedPosition * $scope.duration/100).toFixed(2);
        player.currentTime = $scope.now;
    }

    $scope.getPodcastTitle = function(title){
        if(title.indexOf('-') >= 0)
            return title.split('-')[1];
        return title;
    }
    
});