// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('wait', ['ionic', 'ngMap', 'angularMoment', 'ngRoute', 'ngResource'])

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
  $scope.markers = [{
    lat: 37.765278, 
    long: -122.450168,
    name: "Zazie",
    addr: "941 Cole St., San Francisco, CA 94117",
    hood: "Cole Valley",
    wait: [{text: "I was just told 30 min for two",
         time: new Date ()}]
    },
    {
    lat: 37.782810, 
    long: -122.419031,
    name: "Brenda's",
    addr: "652 Polk St., San Francisco, CA 94102",
    hood: "Tenderloin",
    wait: [{text: "I was just told an hour for two",
         time: new Date ()}]
    },
    {
    lat: 37.790874,  
    long: -122.418952,
    name: "Olea",
    addr: "1494 California St., San Francisco, CA 94109",
    hood: "Nob Hill",     
    wait: [{text: "There are 5 groups ahead of me",
           time: new Date ()}]
    },
    {
    lat: 37.760148,  
    long: -122.504996,
    name: "Outerlands",
    addr: "4001 Judah St., San Francisco, CA 94122",
    hood: "Outer Sunset",
    wait: [{text: "Lines are insane",
           time: new Date ()}]
    },
    {
    lat: 37.774894,   
    long: -122.437639,
    name: "Nopa",
    addr: "560 Divisadero St., San Francisco, CA 94117",
    hood: "NoPa",
    wait: [{text: "I was just told an hour for four",
           time: new Date ()}]
    },
    {
    lat: 37.756431,  
    long: -122.419053 ,
    name: "Foreign Cinema",
    addr: "2534 Mission St., San Francisco, CA 94110",
    hood: "Mission",
    wait: [{text: "40 minutes for 2",
           time: new Date ()}]
    },
    {
    lat: 37.753851, 
    long: -122.420750 ,
    name: "Beretta",
    addr: "1199 Valencia St., San Francisco, CA 94110",
    hood: "Mission",
    wait: [{text: "Too many people, couldn't even make it to the host stand",
          time: new Date ()}]
    },
    {
    lat: 37.801448,   
    long: -122.409594,
    name: "Mama's",
    hood: "North Beach",
    addr: "1701 Stockton St., San Francisco, CA 94133",
    wait: [{text: "Line's about 20 people deep",
           time: new Date ()}]
    },
    {
    lat: 37.761501,   
    long: -122.424318,
    name: "Tartine Bakery",
    addr: "600 Guerrero St., San Francisco, CA 94110",
    hood: "Mission",
    wait: [{text: "I've been here since 6am and still no bread'",
           time: new Date ()}]
    },
    {
    lat: 37.762548,   
    long: -122.395519,
    name: "Plow",
    addr: "1299 18th St., San Francisco, CA 94107",
    hood: "Portrero Hill",
    wait: [{text: "I was just told 30 min for my group of 6",
         time: new Date ()}]
    },
    {
    lat: 37.792545,  
    long: -122.4052774,
    name: "Sushirrito - Kearny St.",
    addr: "226 Kearny St., San Francisco, CA 94104",
    hood: "Financial District",
    wait: [{text: "About 10 other people before me",
         time: new Date ()}]
    },
    {
    lat: 37.7616045,   
    long: -122.4257455,
    name: "Bi-Rite Creamery - Mission",
    addr: "3692 18th St.,San Francisco, CA 94110",
    hood: "Mission",
    wait: [{text: "No line at all!",
         time: new Date ()}]
    },
    {
    lat: 37.7616045,   
    long: -122.4257455,
    name: "Ike's Place",
    addr: "3489 16th St., San Francisco, CA 94114",
    hood: "Mission",
    wait: [{text: "Last one of the day!",
         time: new Date ()}]
    },
    {
    lat: 37.7909483,   
    long: -122.4210184,
    name: "Swan Oyster Depot",
    addr: "1517 Polk St., San Francisco, CA 94109",
    hood: "Lower Nob Hill",
    wait: [{text: "5 people ahead of me, one group of 4 behind me",
           time: new Date ()}]
    },
    {
    lat: 37.7836624,  
    long: -122.4330995,
    name: "State Bird Provisions",
    addr: "1529 Fillmore St., San Francisco, CA 94115",
    hood: "Western Addition",
    wait: [{text: "Lines around the block!",
           time: new Date ()}]
    },
    {
    lat: 37.7787375,   
    long: -122.4089742,
    name: "Blue Bottle - Ferry Building",
    addr: "1 #7 Ferry Bldg Marketplace, San Francisco, CA 94111",
    hood: "Embarcadero",
    wait: [{text: "Long line, but moving fast!",
           time: new Date ()}]
    },
    {
    lat: 37.7747924,   
    long: -122.4375633,
    name: "Bi-Rite Creamery - Divisadero",
    addr: "550 Divisadero St., San Francisco, CA 94117",
    hood: "Nopa",
    wait: [{text: "It's a hot day, and the line's insane",
           time: new Date ()}]
    },
    {
    lat: 37.7681363,   
    long: -122.4247061,
    name: "Mission Beach Cafe",
    addr: "198 Guerrero St., San Francisco, CA 94103",
    hood: "Mission",
    wait: [{text: "Everyone's at BM no line!",
           time: new Date ()}]
    },
    {
    lat: 37.7829048,   
    long: -122.4625607,
    name: "Burma Superstar",
    addr: "309 Clement St., San Francisco, CA 94118",
    hood: "Inner Richmond",
    wait: [{text: "Seated right away!",
           time: new Date ()}]
    },
    {
    lat: 37.7858612,   
    long: -122.4065457,
    name: "Apple Store - New Product Release Days",
    addr: "1 Stockton St., San Francisco, CA 94108",
    hood: "Union Square",
    wait: [{text: "Madness!",
           time: new Date ()}]
    },
    {
    lat: 37.7637365,   
    long: -122.4691241,
    name: "San Tung",
    addr: "1031 Irving St., San Francisco, CA 94122",
    hood: "Inner Sunset",
    wait: [{text: "They told me 30 min, but the wings are worth it!",
           time: new Date ()}]
    },
    {
    lat: 37.7876564,   
    long: -122.4182519,
    name: "Mr. Holmes Bakehouse",
    addr: "1042 Larkin St., San Francisco, CA 94109",
    hood: "Tenderloin",
    wait: [{text: "10 people ahead of me, I've been here for about 10 minutes",
           time: new Date ()}]
    },
    {
    lat: 37.7525656,   
    long: -122.4153353,
    name: "Wise Sons Jewish Delicatessen",
    addr: "3150 24th St., San Francisco, CA 94110",
    hood: "Mission",
    wait: [{text: "5 people ahead of me, line hasn't moved in 15 minutes!",
           time: new Date ()}]
    },
    {
    lat: 37.7964008,   
    long: -122.4068865,
    name: "Golden Gate Bakery",
    addr: "1029 Grant Ave., San Francisco, CA 94133",
    hood: "Chinatown",
    wait: [{text: "http://www.is-the-golden-gate-bakery-open-today.com/ - closed today :(",
           time: new Date ()}]
    }
  ];


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
