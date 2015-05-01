var player;
(function(angular) {
var app = angular.module('app', ['ui.bootstrap'])
app.controller('Ctrl', ['$scope','$http','$compile', function($scope,$http,$compile) {
  $('#vidList').css('height', '0px')
  $scope.curIdx = 0
  $scope.go = function() {
    if ($scope.st === undefined) return
    $('#stage').html('')
    if ($scope.next50 === true) {
      $scope.curStart = new Date($scope.curStart).getTime()+50*24*60*60*1000
      $scope.next50 = false
    } else {
      $scope.curStart = Date.parse($scope.st).getTime() + 24*60*60*1000
    }
    $('#vidList').css('height', window.innerWidth * 0.609375 * ((window.innerWidth<768) ? .8 : .4) +40+'px')
    var end = new Date ($scope.curStart + 24*60*60*50*1000).toISOString() // limit is 50 per query
    $http.get('https://www.googleapis.com/youtube/v3/search?order=date&publishedAfter='+
    new Date($scope.curStart).toISOString()+
    '&publishedBefore='+end+'&part=snippet&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=50&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){
      $scope.vids = res.items.reduce(function(prev,cur) {
        prev.push({id:cur.id.videoId,title:cur.snippet.title})
        return prev
      },[]).reverse()
      $('#stage').append($compile("<div id='ytplayer'></div><br><button class='btn btn-vid' ng-click='next()'><i class='glyphicon glyphicon-forward'></i></button>")($scope))
      player = new YT.Player('ytplayer', {
        height: window.innerWidth * 0.609375 * ((window.innerWidth<768) ? .92 : .4),
        width: window.innerWidth * ((window.innerWidth<768) ? .92 : .4),
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
              $scope.next50 = true
              $scope.go()
            } else {
              player.loadVideoById($scope.vids[$scope.curIdx].id)
            }
          }
          $scope.playedNext = id
        } else {
          ++$scope.curIdx
          player.loadVideoById($scope.vids[$scope.curIdx].id)
        }
      }
      setSize()
      function setSize() {
        var width = $('.col-md-6').outerWidth()
        player.setSize(width,width * 0.609375)
        $('.btn-vid')[0].width(width+'px')
      }
      window.onresize = setSize

    })
  }
  $scope.$watch('st',$scope.go)


}]);
})(window.angular);
