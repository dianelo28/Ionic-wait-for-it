// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('wait', ['ionic', 'ngMap', 'angularMoment', 'ngRoute', 'ngResource'])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: '/templates/start.html',
            controller: 'MainCtrl'
        })
        .when('/search',{
            templateUrl: '/templates/search.html',
            controller: 'MainCtrl'
        })
        .when('/home',{
            templateUrl: '/templates/home.html',
            controller: 'MainCtrl'
        })
        .when('/map',{
            templateUrl: '/templates/map.html',
            controller: 'MainCtrl'

        })
        .when('/business',{
            templateUrl: '/templates/business.html',
            controller: 'MainCtrl'

        })
        .when('/favorites',{
            templateUrl: '/templates/favorites.html',
            controller: 'MainCtrl'

        })
        .when('/signup',{
            templateUrl: '/templates/signup.html',
            controller: 'MainCtrl'

        })
        .when('/login',{
            templateUrl: '/templates/login.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.service('YelpSearch', ['$resource', function($resource) {
    return $resource('http://localhost:3000/search')
}]);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    };
  });
});

app.controller('MainCtrl', ['$scope', 'YelpSearch', function($scope, YelpSearch){
  $scope.tests = YelpSearch.query();
    console.log($scope.tests);


  // $scope.submitWait = function(marker, newWait){
  //   marker.wait.push({
  //     text: newWait,
  //     time: new Date()
  //   });

  //   $scope.newWait = '';

  // };


  // $scope.$on('mapInitialized', function (event, map) {
  //           $scope.objMapa = map;
  //        });

  // $scope.showInfoWindow = function (event, marker) {
  //           var infowindow = new google.maps.InfoWindow();
  //           var center = new google.maps.LatLng(marker.lat, marker.long);

  //           infowindow.setContent(
  //               '<h4>' + marker.name + '</h4>'+
  //               '<h5>' + marker.addr + '</h5>'
  //               );

  //           infowindow.setPosition(center);
  //           infowindow.open($scope.objMapa);
  //           $scope.objMapa.setZoom(15);
  //           $scope.objMapa.setCenter(center);
  //        };

}]);
