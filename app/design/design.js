'use strict';

angular.module('myApp.design', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/design/:id', {
    templateUrl: 'design/design.html',
    controller: 'designCtrl'
  });
}])

.controller('designCtrl', ['$http', '$routeParams', 'DesignListService', '$scope',
    '$document',
    function($http, $routeParams, DesignListService, $scope, $document) {
        var canvas = new fabric.Canvas('canvas');
        canvas.setDimensions({width:450, height:250});
        var context = canvas.getContext('2d');
        
        $scope.designId = $routeParams.id;
        
        $scope.isShowEditHistory = false;
        $scope.textInput = "";
        DesignListService.fetchDesignById($scope.designId)
                .then(function(data) {
                    $scope.design = data;
                    $scope.designSrc = data.src;
                    addImageToCanvas(data.src);
                });
            
        
        
        DesignListService.fetchDesignHistoryById($scope.designId)
            .then(function(data) {
                $scope.designHistory = data;
            })
        
        $scope.toggleEditHistoryDialog = function() {
            $scope.isShowEditHistory = $scope.isShowEditHistory ? false : true; 
        };
        $scope.addText = function() {
            var text = new fabric.Text($scope.textInput, { left: 100, top: 100 });
            canvas.add(text);
        };
        $scope.saveChanges = function() {
            var newImg = $document[0].getElementById('canvas').toDataURL();
            var blob = dataURItoBlob(newImg);
            blob.name = $scope.design.originalName;
            var fd = new FormData();
            fd.append("canvasImage", blob, $scope.design.originalName);
            DesignListService.saveDesign(fd, $scope.designId);
        };
        $scope.selectDesignFromHistory = function(design) {
            $scope.design = design;
            addImageToCanvas(design.src);
        };

        function addImageToCanvas(src) {
            fabric.Image.fromURL(src, function(oImg) {
                oImg.scaleToWidth(300);
                oImg.scaleToHeight(250);
                canvas.clear();
                canvas.add(oImg).renderAll();
            }, { crossOrigin: 'Anonymous' });
        }

        

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
        
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            return new Blob([ia], {type:mimeString});
        }
}]);