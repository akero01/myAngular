'use strict';

/* Controllers */

/* controller for the list of albums to choose from*/
angular.module('Album')
.controller('AlbumListController', ['$scope', 'AlbumService', function ($scope, AlbumService) {
    var init = function () {
    	$scope.albums = AlbumService.getAlbumsFromStorage();
    };

    init();
}]);

/* controller for the album slideshow */
angular.module('Album')
  .controller('AlbumController', ['$scope', '$rootScope', '$routeParams', 'AlbumService', '$interval', '$location', function ($scope, $rootScope, $routeParams, AlbumService, $interval, $location) {
      function AlbumPlan(args) {
          this.pictures = [];
          this.name = args.name;
          this.title = args.title;
          this.image = args.image;
      };
      
      function Picture(args) {
          this.name = args.name;
          this.title = args.title;
          this.description = args.description;
          this.image = args.image;
      }

      var startAlbum = function (name) {
    	  if (name) {
    		 $rootScope.$on("$routeChangeSuccess", function(e, args) {
    	    	  if (pictureTimer && args.loadedTemplateUrl !== 'partials/album.html') {
    	    		  $scope.slideShowPaused = false;
    	    		  $interval.cancel(pictureTimer);
    	    	  }
    	     });
    		 $scope.currentAlbum = AlbumService.getAlbum(name);
    		 $scope.$parent.currentAlbum = $scope.currentAlbum;
             startPicture($scope.currentAlbum.pictures[0]);
    	  }
    	  else {
             return;  // should never get here
    	  }
      };
      
      var pictureTimer;
      var startPicture = function (picture) {
          $scope.currentPicture = picture;
          $scope.currentPictureDuration = 0;    
          if ($scope.currentAlbum.duration > 0) {
              pictureTimer = startPictureTimer();
          }
      };
      
      var startPictureTimer = function() {    
          var picTimer = $interval(function () {
              ++$scope.currentPictureDuration;
          }, 1000, $scope.currentAlbum.duration - $scope.currentPictureDuration);
    	  
    	  picTimer.then(function () {
     		  moveForwardOne();
          });
    	  
    	  return picTimer;
      };
      
      var cancelPictureTimer = function() {
    	  if (pictureTimer) {
    		  $scope.slideShowPaused = false;
    		  $interval.cancel(pictureTimer);
    	  }
      };
      
      $scope.pauseSlideShow = function() {
    	  $interval.cancel(pictureTimer);
    	  $scope.slideShowPaused = true;
      };
      
      $scope.resumeSlideShow = function() {
    	  pictureTimer = startPictureTimer();
    	  $scope.slideShowPaused = false;
      };
      
      $scope.isSlideShowPaused = function() {
    	  return $scope.slideShowPaused;
      };
      
      $scope.pauseResumeSlideShow = function() {
    	  if ($scope.slideShowPaused) {
    		  $scope.resumeSlideShow();
    	  }
    	  else {
    		  $scope.pauseSlideShow();
    	  }
      };
            
      $scope.showProgressBar = function() {
    	  return $scope.currentAlbum.duration > 0;
      }

      $scope.$parent.getAlbumDescription = function() {
    	  if ($scope.currentAlbum.description) {
    	      return $scope.currentAlbum.description.length > 0 ? ' - ' + $scope.currentAlbum.description : '';
    	  }
    	  else {
    		  return '';
    	  }
      }

      var moveForwardOne = function() {
    	  var next = getNextPicture($scope.currentPicture);
          if (next) {
             startPicture(next);
          }
          else {
        	 $scope.currentAlbum.pictures.splice(0, $scope.currentAlbum.pictures.length);
             $location.path('/start');
          }
      };
      
      var getNextPicture = function (currentPicture) {
    	  if (!currentPicture) {
    		  return null
    	  };
    	  
          var nextPicture = null;
          var pos = $scope.currentAlbum.pictures.map(function(pic) { return pic.details.name; }).indexOf(currentPicture.details.name);
          if (pos < $scope.currentAlbum.pictures.length - 1) {
             nextPicture = $scope.currentAlbum.pictures[pos + 1];
          }
          return nextPicture;
      };
      
      var getPreviousPicture = function (currentPicture) {
    	  if (!currentPicture) {
    		  return null
    	  };
    	  
          var previousPicture = null;
          var pos = $scope.currentAlbum.pictures.map(function(pic) { return pic.details.name; }).indexOf(currentPicture.details.name);
          if (pos != 0) {
             previousPicture = $scope.currentAlbum.pictures[pos - 1];
          }
          return previousPicture;
      };
      
      $scope.navBackForward = function(forward) {
    	  $interval.cancel(pictureTimer);
    	  $scope.slideShowPaused = false;
    	  if (forward) {
    		 moveForwardOne();
    	  }
    	  else {
     	     var previous = getPreviousPicture($scope.currentPicture);
             if (previous) {
                startPicture(previous);
             }
             else {
           	    $scope.currentAlbum.pictures.splice(0, $scope.currentAlbum.pictures.length);
                $location.path('/start');
             }

    	  }
      };
      
      var init = function () {
          startAlbum($routeParams.name);
      };

      init();
  }]);