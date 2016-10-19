'use strict';

angular.module('app')
  .controller('RootController', ['$scope', '$location', 'AlbumService', function ($scope, $location, AlbumService) {

	  $scope.mainInfo = AlbumService.getMainInfoFromStorage();
	  
      $scope.$on('$routeChangeSuccess', function (e, current, previous) {
          $scope.currentRoute = current;
      });
      
      $scope.goto = function (album) {
          $location.path('/album/' + album.name);
      };    
              
  }]);
