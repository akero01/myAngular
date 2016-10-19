'use strict';

angular.module('app', ['ngRoute', 'Album', 'AlbumBuilder', 'ngDialog', 'angular-sortable-view', 'LocalStorageModule']).
config(function ($routeProvider, $sceDelegateProvider) {
	/* start (inital) page, album slide show page */
    $routeProvider.when('/start', { 
    	templateUrl: 'partials/start.html', 
    	topNav: 'partials/top-nav.html', 
    	controller: 'AlbumListController' // for now init the album list with this
    });
    
    $routeProvider.when('/album', {
    	templateUrl: 'partials/album.html', 
    	controller: 'AlbumController' 
    });
    
    $routeProvider.when('/album/:name', {
    	templateUrl: 'partials/album.html', 
    	topNav: 'partials/top-nav-album.html', 
    	controller: 'AlbumController' 
    });
    
    /* album builder */
    $routeProvider.when('/builder', {
        redirectTo: '/builder/album'
    });    
    
    $routeProvider.when('/builder/album', {
        templateUrl: 'partials/AlbumBuilder/albums.html',
        topNav: 'partials/AlbumBuilder/top-nav.html',
        controller: 'AlbumBuilderListController'
    });
    
    $routeProvider.when('/builder/albums/new', {
        templateUrl: 'partials/AlbumBuilder/album.html',
        topNav: 'partials/AlbumBuilder/top-nav.html',
        controller: 'AlbumBuilderDetailController',
        resolve: {
            selectedAlbum: ['AlbumBuilderService', function (AlbumBuilderService) {
                return AlbumBuilderService.startBuilding();
            }],
        }
    });
    
    $routeProvider.when('/builder/albums/:name', {
        templateUrl: 'partials/AlbumBuilder/album.html',
        topNav: 'partials/AlbumBuilder/top-nav.html',
        controller: 'AlbumBuilderDetailController',
        resolve: {
            selectedAlbum: ['AlbumBuilderService', '$route', function (AlbumBuilderService, $route) {
                return AlbumBuilderService.startBuilding($route.current.params.name);
            }],
        }
    });
    
    $routeProvider.otherwise({ redirectTo: '/start' });
   
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self']);
});

angular.module('ngDialog', []);
angular.module('Album', []);
angular.module('AlbumBuilder', ['ngDialog']);

