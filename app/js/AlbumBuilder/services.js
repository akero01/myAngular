/// <reference path="services.js" />
'use strict';

/* Services */
angular.module('AlbumBuilder')
    .factory("AlbumBuilderService", ['AlbumService', 'AlbumPlan', 'Pictures', 'Picture', '$routeParams', function (AlbumService, AlbumPlan, Pictures, Picture, $routeParams) {
        var service = {};
        var buildingAlbum;
        var newAlbum;
                
        service.startBuilding = function (name) {
            //We are going to edit an existing album
            if (name) {
                buildingAlbum = AlbumService.getAlbum(name);
                if (buildingAlbum !== null) {
                    newAlbum = false;
                }
                else {
                    buildingAlbum = new AlbumPlan({});
                    newAlbum = true;
                }
            }
            else {
                buildingAlbum = new AlbumPlan({});
                newAlbum = true;
            }
            return buildingAlbum;
        };

        service.removePicture = function (picture) {
            buildingAlbum.pictures.splice(buildingAlbum.pictures.indexOf(picture), 1);
        };
        
        service.addpicture = function () {
        	$scope.addPicture();
        };
        
        service.movepictureTo = function (picture, toIndex) {
            if (toIndex < 0 || toIndex >= buildingAlbum.pictures) return;
            var currentIndex = buildingAlbum.pictures.indexOf(picture);
            buildingAlbum.pictures.splice(toIndex, 0, buildingAlbum.pictures.splice(currentIndex, 1)[0]);
        }
        
        service.save = function () {
            var Album = newAlbum ? service.addAlbum(buildingAlbum)
                                : service.updateAlbum(buildingAlbum);
            newAlbum = false;
            return Album;
        };
        
        service.updateAlbum = function (updateAlbum) {
        	var albumPlans = AlbumService.getAlbums(), index = -1;
        	
        	index = albumPlans.findIndex(function (album) {
        		return album.name === updateAlbum.name;
        	  }
        	);
        	if (index >= 0) {
        		albumPlans[index] = updateAlbum;
        		AlbumService.setAlbumsToStorage(albumPlans);
        	}
        		
        	return updateAlbum;
        };
        
        service.addAlbum = function (newAlbum) {
        	var albumPlans = AlbumService.getAlbums();
        	
        	albumPlans.push(newAlbum);
        	AlbumService.setAlbumsToStorage(albumPlans);
        	
        	return newAlbum;
        };


        service.deleteAlbum = function (deleteAlbum) {
            if (newAlbum) {
            	return; // A new Album cannot be deleted.
            }
            else {
            	var albumPlans = AlbumService.getAlbums(), index = -1;
            	
            	index = albumPlans.findIndex(function (album) {
            		return album.name === deleteAlbum.name;
            	  }
            	);
            	if (index >= 0) {
            		albumPlans.splice(index, 1);
            		AlbumService.setAlbumsToStorage(albumPlans);
            	}
            		
            	return;
            }
            
        }

        return service;
    }]);

//thanks to samson on stackoverflow for this
angular.module( "AlbumBuilder" ).directive('confirmClick', ['ngDialog', function(ngDialog) {
	    return {
	        restrict: 'A',
	        link: function(scope, elt, attrs) {
	            elt.bind('click', function(e) {
	                var message = attrs.confirmation;
	                
	                ngDialog.openConfirm({
	                	template:'\
                            <p>' + message + '</p>\
                            <div class="ngdialog-buttons">\
                                <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
                            </div>',
                        plain: true,
                        scope: scope, 
	                }).then(function (yes) {
	                	scope.$apply(scope.$eval(attrs.confirmClick));
	                	closeThisDialog(0);
	                }, function (error) {
	                	// error
	                });
	            });
	        },
	    };
}]);
