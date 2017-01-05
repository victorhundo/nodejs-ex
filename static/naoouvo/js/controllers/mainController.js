angular.module("naoouvo").controller("main", function($scope, $http, $window){

    var NaoOuvoFeed = "/naoouvo/feed";
    $scope.Npagination = 4;
    var count = 0;
    $http.get(NaoOuvoFeed).success(function(data) {
            $scope.feed = data;
            setCurrentFeed($scope.feed.todos, "Todos");
            setExibition();
    });

    $scope.changeFeed = function(feed, title){
    	setCurrentFeed(feed, title);
    	setExibition();
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
});