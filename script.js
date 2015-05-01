var player;
(function(angular) {
var app = angular.module('app', ['ui.bootstrap'])
app.controller('Ctrl', ['$scope','$http','$compile', function($scope,$http,$compile) {
  $('#vidList').css('height', '0px')

  $scope.go = function(start) {
    $('#stage').html('')
    if ($scope.st === undefined) return
    if (start === undefined) {
      $scope.curStart = new Date (Date.parse($scope.st).getTime() + 24*60*60*1000)
    } else {
      $scope.curStart = $scope.curStart.getTime() + 24*60*60*1000
    }
    $('#vidList').css('height', window.innerWidth * 0.609375 * .5+'px')
    var end = new Date (Date.parse($scope.curStart).getTime() + 24*60*60*50*1000).toISOString() // limit is 50 per query
    $http.get('https://www.googleapis.com/youtube/v3/search?order=date&publishedAfter='+$scope.curStart+
    '&publishedBefore='+end+'&part=snippet&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=50&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){
      $scope.vids = res.items.reduce(function(prev,cur) {
        prev.push({id:cur.id.videoId,title:cur.snippet.title})
        return prev
      },[]).reverse()
      $('#stage').append($compile("<div id='ytplayer'></div><br><button class='btn' ng-click='next()'><i class='glyphicon glyphicon-forward'></i></button>")($scope))
      player = new YT.Player('ytplayer', {
        height: window.innerWidth * 0.609375 * .5,
        width: window.innerWidth * .4,
        videoId: $scope.vids[0].id,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      })
      function onPlayerReady(event) {
        player.playVideo()
      }
      function onPlayerStateChange(event) {
        if (event.target.getPlayerState()===0) {
          $scope.next($scope.vids[$scope.curIdx].id,event)
        }
      }
      $scope.byId = function (idx) {
        player.loadVideoById($scope.vids[idx].id)
        $scope.curIdx = idx
      }
      $scope.next = function(id) {
        if (id !== undefined) {
          if ($scope.playedNext !== id) {
            $scope.$apply(++$scope.curIdx)
            if ($scope.vids[$scope.curIdx]===undefined) {
              $scope.go($scope.curStart+24*60*60*1000)
            }
            player.loadVideoById($scope.vids[$scope.curIdx].id)
            $scope.$apply()
          }
          $scope.playedNext = id
        }
      }
      window.onresize = function() {
        $('#vidList').css('height', window.innerWidth * 0.609375 * .5+'px')
        player.setSize(window.innerWidth * .5,window.innerWidth * 0.609375 * .35)
        $scope.apply()
      }
    })
  }
  $scope.$watch('st',$scope.go)


}]);
})(window.angular);
