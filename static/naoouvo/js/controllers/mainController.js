angular.module("naoouvo").controller("main", function($scope, $http, $window){

    var NaoOuvoFeed = "/naoouvo/feed";
    $http.get(NaoOuvoFeed).success(function(data) {
            $scope.feed = data;
    });
});