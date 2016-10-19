'use strict';

/* Services */

/* used for sending/retrieving things to storage */
angular.module('app')
    .factory("AlbumService", ['AlbumPlan', 'Pictures', 'localStorageService', function (AlbumPlan, Pictures, localStorageService) {
        var service = {};
        var albumPlans = [];
        var mainInfo = {};
        var albumsStorageKey = 'albumplans';
        var mainInfoStorageKey = 'albummaininfo';
        
        /* for now just saving/retrieving things from browser cache */
        service.getAlbumsFromStorage = function () {
        	albumPlans = localStorageService.get(albumsStorageKey);
        	if (albumPlans === null) {
        		albumPlans = [];
        	}
            return albumPlans;
        };
        
        service.setAlbumsToStorage = function (albums) {
        	albumPlans = albums;
        	localStorageService.add(albumsStorageKey, albumPlans);
        };
        
        service.getMainInfoFromStorage = function () {
        	mainInfo = localStorageService.get(mainInfoStorageKey);
        	if (mainInfo === null) {
        		mainInfo = {title: 'Album Title', image: 'img/blank.png'};
        	}
            return mainInfo;
        };
        
        service.setMainInfoToStorage = function (mi) {
        	mainInfo = mi;
        	localStorageService.add(mainInfoStorageKey, mainInfo);
        };
        
        /* general album stuff */
        service.setAlbums = function (albums) {
            albumPlans = albums;
        };

        service.getAlbums = function () {
            return albumPlans;
        };
        
        service.getAlbum = function (name) {
            var result = null;
            angular.forEach(service.getAlbums(), function (album) {
                if (album.name === name) {
                	result = angular.copy(album);
                }
            });
            return result;
        };
        
        return service;
}]);
