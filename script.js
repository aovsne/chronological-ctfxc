
(function(angular) {
  'use strict';
var app = angular.module('app', ['ui.bootstrap'])

app.controller('Ctrl', ['$scope','$http', function($scope,$http) {
  $scope.go = function() {
    console.log($scope.st)
    $http.get('https://www.googleapis.com/youtube/v3/search?publishedAfter='+$scope.st+'&publishedBefore='+$scope.en+'&part=id&channelId=UCvphW8g3rf4m8LnOarxpU1A&publishedBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=1000&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){console.log(res)});
  }


}]);
})(window.angular);
