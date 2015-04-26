
(function(angular) {
  'use strict';
var app = angular.module('app', ['ngResource']);

app.controller('Ctrl', ['$scope','$resource','$http', function($scope,$resource,$http) {
  $scope.getVids = function() {
    $http.get('https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyC-JkmgW8D2MB3Iqc176RJz4qO7WMa5lew%20&part=snippet,statistics&fields=items(id,snippet,statistics)')
    .success(function(res){console.log(res)});
  }
}]);
})(window.angular);
