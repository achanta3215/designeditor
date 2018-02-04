'use strict';

var apiUrl = "http://localhost:3000"
angular.module('myApp.services', [])

.factory('DesignListService', ['$http', '$q', function($http, $q) {
    var uploadDesign = function(design) {
        var url = apiUrl + "/uploadDesign";
        var fd = new FormData();
        var file = document.getElementById('file').files[0];
        fd.append('file', file);
        $http.post(url, fd, {
            //headers: {'Content-Type': 'multipart/form-data' }//,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        })
            .then(function(data){
                console.log(data);
            });
    };
    var fetchDesigns = function() {
        var url = apiUrl + "/designs";
        return $http({
            method: 'GET',
            url: url, 
            })
            .then(function(response) {
                var data = response.data;
                var imagePromises = [];
                data.forEach(function(element) {
                    var imgUrl = apiUrl + '/designFile?serverFileName=' + element.serverFileName;
                    element.src = imgUrl;
                    });
                return data;
            });
    };
    var fetchDesignById = function(id) {
        var url = apiUrl + "/design?id=" + id;
        return $http({
            method: 'GET',
            url: url
            }).then(function(response) {
                var imgUrl = apiUrl + '/designFile?serverFileName=' + 
                    response.data.serverFileName;
                response.data.src = imgUrl;
                return response.data;
            });
    };
    var saveDesign = function(fd, designId) {
        var url = apiUrl + "/design?id=" + designId;
        
        return $http.post(url, fd, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(data){
                console.log(data);
            });
    };
    var fetchDesignHistoryById = function(designId) {
        var url = apiUrl + "/designHistory?id=" + designId;
        return $http.get(url)
            .then(function(response) {
                response.data.forEach(function(element) {
                    var imgUrl = apiUrl + '/designFile?serverFileName=' + element.serverFileName;
                    element.src = imgUrl;
                    });
                return response.data;
            });
    };
    return {uploadDesign: uploadDesign, fetchDesigns: fetchDesigns, 
        fetchDesignById: fetchDesignById, saveDesign: saveDesign,
        fetchDesignHistoryById: fetchDesignHistoryById};
}]);