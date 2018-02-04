'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$http', function($http) {
  $http.get('http://localhost:3000/user')
    .success(function(resp){
      console.log(resp);
    });
}]);