
(function(angular) {
  'use strict';
var app = angular.module('app', ['ui.bootstrap'])

app.controller('Ctrl', ['$scope','$http','$compile', function($scope,$http,$compile) {
  $scope.go = function() {
    $('#stage').html('')
    if ($scope.st===undefined) return
    var end = new Date (Date.parse($scope.st).getTime() + 24*60*60*50*1000).toISOString() // limit is 50 per query
    $http.get('https://www.googleapis.com/youtube/v3/search?order=date&publishedAfter='+dtToISO($scope.st)+
    '&publishedBefore='+end+'&part=snippet&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=50&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){
      $scope.vids = res.items.reduce(function(prev,cur) {
        prev.push({id:cur.id.videoId,title:cur.snippet.title})
        return prev
      },[]).reverse()
      $scope.player
      $scope.next = function(id) {
        if (id !== undefined) {
          if ($scope.playedNext !== id) {
            $scope.$apply(++$scope.curIdx)
            $scope.player.loadVideoById($scope.vids[$scope.curIdx].id)
            $scope.$apply()
          }
          $scope.playedNext = id
        } else {
          $scope.$apply(++$scope.curIdx)
          event.target.loadVideoById($scope.vids[$scope.curIdx].id)
          $scope.$apply()
        }

      $('#stage').append($compile("<div id='ytplayer'></div><br><button class='btn' ng-click='next()'><i class='glyphicon glyphicon-forward'></i></button>")($scope))
      $scope.player = new YT.Player('ytplayer', {
        height: window.innerWidth * 0.609375 * .5,
        width: window.innerWidth * .4,
        videoId: $scope.vids[0].id,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      })
      function onPlayerReady(event) {
        event.target.playVideo()
      }
      function onPlayerStateChange(event) {
        if (event.target.getPlayerState()===0) {
          $scope.next($scope.vids[$scope.curIdx].id,event)
        }
      }
      }
      window.onresize = function() {
        $('#vidList').css('height', window.innerWidth * 0.609375 * .35+'px')
        $scope.player.setSize(window.innerWidth * .35,window.innerWidth * 0.609375 * .35)
        $scope.apply()
      }
    })
  }
  $scope.$watch('st',$scope.go)
  function dtToISO(date) {
    if (date === undefined || date === null)
      return new Date().toISOString()
    return Date.parse(date).toISOString()
  }

  $scope.play = function(playIdx) {
    if (playIdx === undefined) {
      $scope.curIdx++
    } else {
      $scope.curIdx = playIdx
    }
    var cur = $scope.vids[$scope.curIdx]
    // youtube



  }

  $('#vidList').css('height', window.innerWidth * 0.609375 * .35+'px')

}]);
})(window.angular);
