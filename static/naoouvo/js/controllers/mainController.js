angular.module("naoouvo").controller("main", function($scope, $http, $window, $sce){

    $scope.onPlay = false;

    $scope.play = function(){
        var player = document.getElementById('player');
        $scope.onPlay  = true;
        player.play();
    }

    $scope.pause = function(){
        $scope.onPlay  = false;
        var player = document.getElementById('player');
        player.pause();
    }

    $scope.trustSrc = function() {
        return $sce.trustAsResourceUrl($scope.currentAudio.link);
    }
    var NaoOuvoFeed = "/naoouvo/feed";
    $scope.Npagination = 4;
    var count = 0;
    $http.get(NaoOuvoFeed).success(function(data) {
            $scope.feed = data;
            setCurrentFeed($scope.feed.todos, "Todos");
            setCurrentAudio($scope.currentFeed[0]);
            setExibition();
    });

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
        }else{
            $scope.now = player.currentTime
            $scope.duration = player.duration
            $scope.durationPorcent = parseFloat(Math.round($scope.now * 100) / $scope.duration).toFixed(2);
            $scope.durationInt = Math.ceil( $scope.durationPorcent );
        }
        
        $scope.$apply();

    }
    //setInterval(updateSeek, 100);

    var updateProgressBar = function(e){
        $scope.barWidth = e.target.clientWidth;
    }


    $scope.handleProgressBarClick = function(e){
        var fullProgressBarWidth = e.target.clientWidth;
        $scope.requestedPosition = (e.layerX / fullProgressBarWidth * 100).toFixed(2);

        var player = document.getElementById("player");
        $scope.durationPorcent = $scope.requestedPosition;
        player.currentTime = e.layerX;

    }
});