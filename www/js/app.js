// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('wait', ['ionic', 'ngMap', 'angularMoment', 'ngRoute']);

app.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);

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
            controller: 'HomeCtrl'
        })
        .when('/map',{
            templateUrl: '/templates/map.html',
            controller: 'HomeCtrl'

        })
        .when('/business/:id',{
            templateUrl: '/templates/business.html',
            controller: 'BizCtrl'

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
        .when('/alert',{
            templateUrl: '/templates/alert.html',
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

// app.service('YelpSearch', ['$resource', function($resource) {
//     return $resource('http://localhost:3000/api/search');
// }]);



app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){


  $scope.search = function (s){
    $http.post('http://localhost:3000/api/search/' + s.term, s)
      .then(function(response){
      $location.path('/home');
      $rootScope.spots = response.data;
      });
  };

  // $scope.spots = YelpSearch.query();
  // console.log($scope.spots);

  // $scope.search() = function(){
  //   $scope.restaurant
  // }

  // $scope.submitWait = function(marker, newWait){
  //   marker.wait.push({
  //     text: newWait,
  //     time: new Date()
  //   });

  //   $scope.newWait = '';

  // };

}]);

app.controller('HomeCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

  $rootScope.spots = $scope.spots;


  $scope.$on('mapInitialized', function (event, map) {
            $scope.objMapa = map;
         });

  $scope.showInfoWindow = function (event, spot) {
            var infowindow = new google.maps.InfoWindow();
            var center = new google.maps.LatLng(spot.location.coordinate.latitude, spot.location.coordinate.longitude);

            infowindow.setContent(
                '<h4>' + spot.name + '</h4>' +
                '<h4>' + spot.location.display_address[0] + ", " + spot.location.display_address[2] + '</h4>'                
            );

            infowindow.setPosition(center);
            infowindow.open($scope.objMapa);
            $scope.objMapa.setZoom(15);
            $scope.objMapa.setCenter(center);
         };
}]);

app.controller('BizCtrl', ['$scope', '$rootScope', '$ionicModal', function($scope, $rootScope, $ionicModal){
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.waitTime = function(business, wait){
    $scope.wait.value = $scope.amt

    business.wait.push(
        time: $scope.wait.value
        time: new Date()
      )
    }

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
