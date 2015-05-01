
(function(angular) {
  'use strict';
var app = angular.module('app', ['ui.bootstrap'])

app.controller('Ctrl', ['$scope','$http', function($scope,$http) {
  $scope.go = function() {
    $http.get('https://www.googleapis.com/youtube/v3/search?publishedAfter='+dtToISO($scope.st)+
    '&publishedBefore='+dtToISO($scope.en)+'&part=id&channelId=UCvphW8g3rf4m8LnOarxpU1A&publish'+
    'edBefore=2015-01-05T05%3A17%3A02.102Z&maxResults=1000&key=AIzaSyDAoUvvtnXog6O4IoxcUXTG6vHSB9fyaxM')
    .success(function(res){console.log(res.items)});
  }
  dtToISO = function() {
    if ($scope.dt === undefined || $scope.dt === null)
      return Math.floor(Date.now().toISOString())
    return Math.floor(Date.parse($scope.dt).getTime().toISOString())
  }

  $scope.play = function(playIdx) {
      $('#stage').html("")
      if (playIdx === undefined) {
        $scope.curIdx++
      } else {
        $scope.curIdx = playIdx
      }
      var cur = $scope.media[$scope.curIdx]
      addIDToStorage(cur.id,$routeParams.sub)
      // soundcloud
      if (cur.type === 'sc') {
        $http.jsonp('http://soundcloud.com/oembed?format=js&url='+
        cur.scuri
        +'&callback=JSON_CALLBACK&auto_play=true')
        .success(function(res) {
          $('#stage').append(res.html)
          var widgetIframe = $('iframe')[0],
          widget       = SC.Widget(widgetIframe)
          $scope.next = function() {$scope.play()}
          $scope.updateMenu()
          widget.bind(SC.Widget.Events.READY, function() {
            widget.bind(SC.Widget.Events.FINISH, function() {
              $scope.play()
            })
          })
        })
      }
      // vimeo
      else if (cur.type === 'vi') {
        $scope.next = function() {$scope.play()}
        $scope.updateMenu()
        var html = '<iframe id="vimeo_player" src="http://player.vimeo.com/video/'+cur.viuri+'?autoplay=1&api=1&player_id=vimeo_player" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        $('#stage').append(html)
        var iframe = $('#vimeo_player')[0];
        var player = $f(iframe);
        player.addEvent('ready', function() {
          addIDToStorage(cur.id)
          player.addEvent('finish', finish)
          function finish() {
            $scope.play()
          }
        })
        document.getElementById('vimeo_player').width= window.innerWidth * .9
        document.getElementById('vimeo_player').height= window.innerWidth * 0.609375 * .9
        window.onresize = function() {
          document.getElementById('vimeo_player').width= window.innerWidth * .9
          document.getElementById('vimeo_player').height= window.innerWidth * 0.609375 * .9

        }
      }
      // youtube
      else if (cur.type ==='yt') {
        $scope.next = function(id,event) {
          if (id !== undefined) {
            if ($scope.playedNext !== id) {
              if ($scope.media[$scope.curIdx+1].type==='yt') {
                $scope.$apply(++$scope.curIdx)
                event.target.loadVideoById($scope.media[$scope.curIdx].ytid)
                $scope.$apply()
              } else {
                $scope.play()
              }
            }
            $scope.playedNext = id
          } else {
              $scope.play()
          }
        }
        function onPlayerReady(event) {
          event.target.playVideo()
        }
        function onPlayerStateChange(event) {
          try {
            addIDToStorage($scope.media[$scope.curIdx].id)
            if (event.target.getPlayerState()===0) {
              $scope.next($scope.media[$scope.curIdx].id,event)
            }
          }
          catch (e) {console.log(e)}
        }
        $('#stage').append("<div id='ytplayer'></div>")
        player = new YT.Player('ytplayer', {
          height: window.innerWidth * 0.609375 * .7,
          width: window.innerWidth * .7,
          videoId: $scope.media[$scope.curIdx].ytid,
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
    }


}]);
})(window.angular);
