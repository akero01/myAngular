'use strict';

// controller for the list of albums and the album collection title/image in the album builder
angular.module('AlbumBuilder')
  .controller('AlbumBuilderListController', ['$scope', 'AlbumBuilderService', 'AlbumService', '$location', function ($scope, AlbumBuilderService, AlbumService, $location) {
      $scope.goto = function (album) {
          $location.path('/builder/albums/' + album.name);
      }
      
      $scope.deleteAnAlbum = function (album) {
    	  AlbumBuilderService.deleteAlbum(album);
      }

      /* maininfo -> Album collection image and title */
      $scope.setMainInfo = function () {
    	  $scope.mainInfo.dirty = false;
   	      AlbumService.setMainInfoToStorage($scope.mainInfo);
      }
      
      $scope.mainInfoChange = function (fileEvent) {
    	  $scope.mainInfo.dirty = true;
    	  if (fileEvent) {
    		  $scope.mainInfo.image = "img/" + fileEvent.value.split('\\').pop();
    		  $scope.$apply();
    	  }
      }
      
      var init = function () {
          $scope.$parent.showAlbumsButton = false;
          $scope.$parent.showNewAlbumButton = true;
          $scope.albums = AlbumService.getAlbumsFromStorage();
      };
      init();
  }]);

// controller for edit/create album
angular.module('AlbumBuilder')
  .controller('AlbumBuilderDetailController', ['$scope', 'AlbumBuilderService', 'AlbumService', 'selectedAlbum', '$location', '$routeParams', 'ngDialog', 'Picture', function ($scope, AlbumBuilderService, AlbumService, selectedAlbum, $location, $routeParams, ngDialog, Picture) {
      $scope.save = function () {
          $scope.submitted = true;
          if ($scope.formAlbum.$invalid) {
        	  return;
          }
          $scope.album = AlbumBuilderService.save();
          $scope.albums = AlbumService.getAlbumsFromStorage();
          $scope.formAlbum.$setPristine();
          $scope.submitted = false;
          $scope.albumUpdate = true;
      }
            
      // controller for pictures in an album
      var PictureController = function ($scope) {
    	  if ($scope.ngDialogData) {
    	      $scope.picture = $scope.ngDialogData.details;
    	  }
    	  else {
    		  $scope.picture = new Picture({
                          name: "",
                          title: "",
                          description: "",
                          image: 'img/blank.png'
                      });
    	  }
    	  
    	  // value from file explorer
          $scope.filePopupPictureChange = function (fileEvent) {
        	  $scope.formPicture.$dirty = true;
        	  $scope.picture.image = "img/" + fileEvent.value.split('\\').pop();
        	  $scope.$apply();
          }
    	  
    	  // try and add/edit button changes
          $scope.ok = function () {              
              var pic = {
                  details: new Picture({
                      name: $scope.formPicture.pictureName.$modelValue,
                      title: $scope.formPicture.title.$modelValue,
                      description: $scope.formPicture.description.$modelValue,
                      image: $scope.formPicture.image.$modelValue ? $scope.formPicture.image.$modelValue : '/img/blank.png'
                  })
              }
        	  
              
              // error - let them fix it
              if (!pic.details.name || !pic.details.title || 
            		  ($scope.formPicture.pictureName.$error.unique === true) ) {
            	  return;
              }
             
              if ($scope.ngDialogData) {
                 $scope.album.pictures[$scope.album.pictures.indexOf($scope.ngDialogData)] = pic;
              }
              else {
                 $scope.album.pictures.push(pic);
              }
              $scope.picture = null;
              $scope.formAlbum.$dirty = true;
              ngDialog.close();
          };
      };
      
      // add a picture using ngDialog
      $scope.addPicture = function () {    	  
    	  ngDialog.open({
              template: 'partials/AlbumBuilder/picture.html',
              controller: PictureController,
              scope: $scope,
              className: 'ngdialog-theme-default picture-popup',
              closeByDocument: false,
              pictue: null
          });
      }
      
      // delete an existing picture
      $scope.removePicture = function (picture) {
    	  AlbumBuilderService.removePicture(picture);
      }
      
      // edit an existing picture
      $scope.editPicture = function (picture) {
    	  ngDialog.open({
              template: 'partials/AlbumBuilder/picture.html',
              controller: PictureController,
              scope: $scope,
              className: 'ngdialog-theme-default picture-popup',
              closeByDocument: false,
              data: picture
          });
      }


      // dirty things on picture sorting
      $scope.onPictureSort = function () {
    	  $scope.formAlbum.$dirty = true; 
      };
      
      $scope.filePictureChange = function (fileEvent) {
    	  $scope.formAlbum.$dirty = true;
    	  $scope.album.image = "img/" + fileEvent.value.split('\\').pop();
    	  $scope.$apply();
      }
      
      // the name field changed - make sure it's unique
      $scope.itChanged = function (modelController) {
    	 if (modelController.$name == "albumName" && $scope.albums)
 	     {
    		var i = 0;
    		modelController.$setValidity('unique', true);
 		    for (i = 0; i < $scope.albums.length; i++) {
 			  if ($scope.albums[i].name === modelController.$modelValue) {
 				  name.$setValidity('unique', false);
 				  break;
 			  }
 		    }
 	     }
    	 else if (modelController.$name == "pictureName" && $scope.album) {
     		var i = 0;
     		modelController.$setValidity('unique', true);
 		    for (i = 0; i < $scope.album.pictures.length; i++) {
  			  if ($scope.album.pictures[i].details.name === modelController.$modelValue) {
  				  modelController.$setValidity('unique', false);
  				  anError = true;
  				  break;
  			  }
  		    }
  		 }
      };
      
      // check for errors in album or picture form
      $scope.hasError = function (modelController, error) {
    	  return (modelController.$dirty || $scope.submitted) && error;
      }

      // reset to original values
      $scope.reset = function () {
    	  $scope.album = AlbumBuilderService.startBuilding($scope.album.name);
          $scope.formAlbum.$setPristine();
          $scope.submitted = false;
      };

      // delete an album
      $scope.deleteAlbum = function () {
          AlbumBuilderService.deleteAlbum();
          $location.path('/builder/album/');
      };
      
      var init = function () {
    	  $scope.$parent.showAlbumsButton = true;
    	  $scope.$parent.showNewAlbumButton = false;
          $scope.album = selectedAlbum;
          $scope.albums = AlbumService.getAlbumsFromStorage();
          if (selectedAlbum.name) {
        	  $scope.albumUpdate = true;
          }
          else {
        	  $scope.albumUpdate = false;
          }
      };
      init();
  }]);
