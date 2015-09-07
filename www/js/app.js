// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('wait', ['ionic', 'ngMap', 'angularMoment', 'ngRoute', 'satellizer']);

app.config(['$ionicConfigProvider', "$authProvider", function($ionicConfigProvider, $authProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    $authProvider.loginUrl = 'http://localhost:3000/auth/login';
    $authProvider.signupUrl = 'http://localhost:3000/auth/signup';
    $authProvider.facebook({
      clientId: '865103580253448',
      url: 'http://localhost:3000/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
      redirectUri: (window.location.origin || window.location.protocol + '//' + window.location.host) + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 580, height: 400 }
    });


}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: '/templates/start.html',
            controller: 'MainCtrl',
            requireAuth: false,
            onBoard: true
        })
        .when('/search',{
            templateUrl: '/templates/search.html',
            controller: 'MainCtrl',
            requireAuth: false
        })
        .when('/home',{
            templateUrl: '/templates/home.html',
            controller: 'HomeCtrl',
            requireAuth: false
        })
        .when('/map',{
            templateUrl: '/templates/map.html',
            controller: 'HomeCtrl',
            requireAuth: false

        })
        .when('/business/:id',{
            templateUrl: '/templates/business.html',
            controller: 'BizCtrl',
            requireAuth: true
        })
        .when('/favorites',{
            templateUrl: '/templates/favorites.html',
            controller: 'FavCtrl',
            requireAuth: true

        })
        .when('/signup',{
            templateUrl: '/templates/signup.html',
            controller: 'SignupCtrl',
            requireAuth: false
        })
        .when('/login',{
            templateUrl: '/templates/login.html',
            controller: 'LoginCtrl',
            requireAuth: false
        })
        .when('/alert',{
            templateUrl: '/templates/alert.html',
            controller: 'MainCtrl',
            requireAuth: true
        })
        .otherwise({
            redirectTo: '/'
        })

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.run(["$rootScope", "$location", "$auth", function($rootScope, $location, $auth) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!$auth.isAuthenticated() && next.requireAuth) {
            $rootScope.savedLocation = $location.url();
            $location.path('/login'); 
        }
        if ($auth.isAuthenticated() && next.onBoard) {
            $location.path('/favorites');
        }
    })
}])

app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$location', '$auth', function($scope, $rootScope, $http, $location, $auth){

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

app.controller('HomeCtrl', ['$scope', '$rootScope', '$auth','$http', function($scope, $rootScope, $auth, $http){

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
         
    $scope.isAuthenticated = function() {
    //check if user is logged in
    return $auth.isAuthenticated();
  };

  $scope.favorites = function(spot) {
    if (JSON.parse(localStorage.currentUser).favorites.indexOf(spot.id) != -1) {
      console.log("already favorited, dont forget to code delete route");
    } else {
    userid = JSON.parse(localStorage.currentUser)._id;
      $http.put('http://localhost:3000/api/'+userid+'/favorites', {id: spot.id})
        .then(function(response){
          var temp = JSON.parse(localStorage.currentUser);
          temp.favorites.push(response.data);
          localStorage.setItem("currentUser", JSON.stringify(temp));
        });
    };  
  };

  $scope.checkFavorites = function(spot) {
    if (_.findWhere(JSON.parse(localStorage.currentUser).favorites, {business_id: spot.id}) != undefined) {
      return "ion-ios-heart";
    } else {
      return "ion-ios-heart-outline";
    }
  }

}]);

app.controller('FavCtrl', ['$scope', function($scope) {
  $scope.favspots = JSON.parse(localStorage.currentUser).favorites;
}]);

app.controller('BizCtrl', ['$scope', '$rootScope', '$ionicModal', '$http', '$routeParams', function($scope, $rootScope, $ionicModal, $http, $routeParams){
  $http.get('http://localhost:3000/api/business/' + $routeParams.id)
      .then(function(response){
        $scope.spot = response.data;
        console.log($scope.spot)
      });

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

  $scope.waitTime = function(business){
    $http.put('http://localhost:3000/api/business/' + $routeParams.id, business)
      .then(function(response){
        console.log(response.data)
        $scope.business = response.data;
        $scope.modal.hide();
      });
    };  

  $scope.linkFacebook = function() {
    // connect email account with instagram
    $auth.link('facebook')
      .then(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response.data.user);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      });
  };  

}]);

app.controller('LoginCtrl', ['$scope', '$rootScope', '$window', '$auth', '$location', function($scope, $rootScope, $window, $auth, $location){

    $scope.facebookLogin = function() {
      $auth.authenticate('facebook')
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data.user);
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        })
        .catch(function(response) {
          console.log(response.data);
        });
    };
    $scope.emailLogin = function(sec) {
      $auth.login({ email: sec.email, password: sec.password })
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data.user);
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
          $location.path($rootScope.savedLocation || '/home')
        })
        .catch(function(response) {
          $scope.errorMessage = {};
          angular.forEach(response.data.message, function(message, field) {
            $scope.loginForm[field].$setValidity('server', false);
            $scope.errorMessage[field] = response.data.message[field];
          });
        });
    };    
}]);

app.controller('SignupCtrl', ['$scope', '$auth', '$location','$window','$rootScope', function($scope, $auth, $location, $window, $rootScope){

  $scope.signup = function(sec) {
    var user = {
      email: sec.email,
      password: sec.password
    };
    // Satellizer
    $auth.signup(user)
      .then(function(response) {
        $auth.login({ email: user.email, password: user.password})
          .then(function(response) {
            $window.localStorage.currentUser = JSON.stringify(response.data.user);
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            $location.path($rootScope.savedLocation || '/home')
          })
          .catch(function(response) {
            $scope.errorMessage = {};
            angular.forEach(response.data.message, function(message, field) {
              $scope.loginForm[field].$setValidity('server', false);
              $scope.errorMessage[field] = response.data.message[field];
            });
          });
      });
  };

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
