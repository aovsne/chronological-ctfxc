
(function(angular) {
  'use strict';
var app = angular.module('app', ['ui.bootstrap'])

app.controller('Ctrl', ['$scope','$http', function($scope,$http) {
  $scope.go = function() {
    var end = new Date (Date.parse($scope.st).getTime() + 24*60*60*50*1000).toISOString() // limit is 50 per query
    $http.get('https://www.googleapis.com/youtube/v3/search?part=id&publishedAfter='+dtToISO($scope.st)+
    '&publishedBefore='+end+'&part=id&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=50&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){
      $scope.ids = res.items.reduce(function(prev,cur) {
        console.log(cur.id.videoId)
        prev.push(cur.id.videoId)
        return prev
      },[])
      console.log($scope.ids)
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
    $('#stage').append("<div id='ytplayer'></div>")
    player = new YT.Player('ytplayer', {
      height: window.innerWidth * 0.609375 * .7,
      width: window.innerWidth * .7,
      videoId: $scope.ids[$scope.curIdx].ytid,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': $scope.next
      }
    })
    window.onresize = function() {
      player.setSize(window.innerWidth * .9,window.innerWidth * 0.609375 * .9)
    }
  }


}]);
})(window.angular);
