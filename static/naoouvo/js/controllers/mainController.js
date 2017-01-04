angular.module("naoouvo").controller("main", function($scope, $http, $window){

    var NaoOuvoFeed = "/naoouvo/feed";
    $scope.Npagination = 4;
    $http.get(NaoOuvoFeed).success(function(data) {
            $scope.feed = data;
            $scope.nPag = Math.floor($scope.feed.todos.length / $scope.Npagination)
        	$scope.currentPag = 1;
    });

    $scope.listInicio = 0;
    $scope.listFinal = 4;
 
    $scope.nextPag = function(){
        if($scope.currentPag < $scope.nPag)
            $scope.currentPag++;
        else
            $scope.currentPag = 1;
    }

    $scope.prevPag = function(){
        if($scope.currentPag > 1)
            $scope.currentPag--;
        else
            $scope.currentPag = $scope.nPag;
    }
});