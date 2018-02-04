'use strict';

angular.module('myApp.design-list', [])

.controller('DesignListCtrl', [ '$scope', 'DesignListService', '$location',
        function($scope, DesignListService, $location) {
    DesignListService.fetchDesigns()
        .then(function(data) {
            $scope.designs = data;
        });
    $scope.isShowNewDesignPopup = false;
    $scope.design = {file: null};
    $scope.openNewDesignPopup = function() {
        $scope.isShowNewDesignPopup = true;
    };
    $scope.closeNewDesignPopup = function() {
        $scope.isShowNewDesignPopup = false;
    };
    $scope.uploadDesign = function() {
        DesignListService.uploadDesign($scope.design.file);
    };
    $scope.openDesign = function(design) {
        $location.path('design/' + design.id);
    };
}])

.directive('designList', function() {
    return {
        controller: 'DesignListCtrl',
        templateUrl: 'home/design-list/design-list.html'
    }
})

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);