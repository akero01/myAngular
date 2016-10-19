'use strict';

/* Model classes */

/* individual album */
angular.module('app')
    .factory('AlbumPlan', function () {
    	function AlbumPlan(args) {
            this.pictures = [];
            this.name = args.name;
            this.title = args.title;
            this.image = args.image;
            this.description = args.description;
            this.duration = 0;
            this.drag = true;
        };
        return AlbumPlan;
});

/* pictures in an album */
angular.module('app')
    .factory('Pictures', function () {
        function Pictures(args) {
            this.pictures = args.pictures;
        }
        return Pictures;
});

/* individual picture */
angular.module('app')
.factory('Picture', function () {
    function Picture(args) {
        this.name = args.name;
        this.title = args.title;
        this.description = args.description;
        this.image = args.image;
        this.drag = true;
    }
    return Picture;
});
