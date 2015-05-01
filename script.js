
(function(angular) {
  'use strict';
var app = angular.module('app', ['ui.bootstrap'])

app.controller('Ctrl', ['$scope','$http','$compile', function($scope,$http,$compile) {
  $scope.go = function() {
    var end = new Date (Date.parse($scope.st).getTime() + 24*60*60*50*1000).toISOString() // limit is 50 per query
    $http.get('https://www.googleapis.com/youtube/v3/search?order=date&publishedAfter='+dtToISO($scope.st)+
    '&publishedBefore='+end+'&part=id&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=50&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){
      $scope.ids = res.items.reduce(function(prev,cur) {
        prev.push(cur.id.videoId)
        return prev
      },[]).reverse()
      $scope.play(0)
    })
  }
  function dtToISO(date) {
    if (date === undefined || date === null)
      return new Date().toISOString()
    return Date.parse(date).toISOString()
  }

  $scope.play = function(playIdx) {
    var player
    $('#stage').html("")
    if (playIdx === undefined) {
      $scope.curIdx++
    } else {
      $scope.curIdx = playIdx
    }
    var cur = $scope.ids[$scope.curIdx]
    // youtube
    $scope.next = function(id,event) {
      console.log('hello')
      if ($scope.playedNext !== id) {
          $scope.$apply(++$scope.curIdx)
          event.target.loadVideoById($scope.ids[$scope.curIdx])
          $scope.$apply()
      }
      $scope.playedNext = id
    }
    function onPlayerReady(event) {
      event.target.playVideo()
    }
    function onPlayerStateChange(event) {
      if (event.target.getPlayerState()===0) {
        $scope.next($scope.ids[$scope.curIdx],event)
      }
    }
    $('#stage').append($compile("<div id='ytplayer'></div><br><button class='btn' ng-click='next()'><i class='glyphicon glyphicon-forward'></i></button>")($scope))
    player = new YT.Player('ytplayer', {
      height: window.innerWidth * 0.609375 * .4,
      width: window.innerWidth * .4,
      videoId: $scope.ids[$scope.curIdx],
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
      }
    })
    window.onresize = function() {
      player.setSize(window.innerWidth * .4,window.innerWidth * 0.609375 * .4)
    }
  }


}]);
})(window.angular);
