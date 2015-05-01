
(function(angular) {
  'use strict';
var app = angular.module('app', ['ngResource']);

app.controller('Ctrl', ['$scope','$resource','$http', function($scope,$resource,$http) {
  $scope.getVids = function() {
    $http.get('https://www.googleapis.com/youtube/v3/channels?key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM&forUsername=ctfxc&part=id')
    .success(function(res){console.log(res)});
  }

}]);
})(window.angular);
