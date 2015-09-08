var app = angular.module('wait', ['ionic', 'ngMap', 'angularMoment', 'satellizer', 'ngCordova']);

var host = 'http://localhost:3000' 
           // 'https://waitforit.herokuapp.com'

app.config(['$ionicConfigProvider', "$authProvider", function($ionicConfigProvider, $authProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    $authProvider.loginUrl = host+'/auth/login';
    $authProvider.signupUrl = host+'/auth/signup';
}]);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        // home page
        .state('start', {
            url:'',
             views: {
              "start": {
                      templateUrl: 'templates/start.html',
                      controller: 'MainCtrl',
                      requireAuth: false,
                      onBoard: true
                       }
             }
        })
        .state('search',{
            url: '/search',
            views: {
              "start": {
                      templateUrl: 'templates/search.html',
                      controller: 'MainCtrl',
                      requireAuth: false
                      }
            }
        })
        .state('home',{
            url:'/home',
            views: {
            "start": {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl',
                    requireAuth: false
                     }
            }
        })
        .state('map',{
            url:'/map',
            views: {
            "start":{
                    templateUrl: 'templates/map.html',
                    controller: 'HomeCtrl',
                    requireAuth: false
                   }
            }
        })
        .state('business',{
            url:'/business/:id',
            views: {
            "start":{ 
                    templateUrl: 'templates/business.html',
                    controller: 'BizCtrl',
                    requireAuth: true
                    }
            }
        })
        .state('favorites',{
            url:'/favorites',
            views: {
            "start":{
                    templateUrl: 'templates/favorites.html',
                    controller: 'FavCtrl',
                    requireAuth: true
                    }
            } 
        })
        .state('signup',{
            url: '/signup',
            views: {
            "start":{
                    templateUrl: '/templates/signup.html',
                    controller: 'SignupCtrl',
                    requireAuth: false
                    }
            }
        })
        .state('login',{
            url:'/login',
            views:{
            "start":{
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl',
                    requireAuth: false
                    }
           } 
        })
        .state('alert',{
            url:'/alert',
            views:{
            "start":{
                    templateUrl: 'templates/alert.html',
                    controller: 'MainCtrl',
                    requireAuth: true
                    }
            }
        })
    $urlRouterProvider.otherwise('/')

    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
});

app.run(["$rootScope", "$location", "$auth", function($rootScope, $location, $auth) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!$auth.isAuthenticated() && next.requireAuth) {
            $rootScope.savedLocation = $location.url();
            $location.path('/login'); 
        };
        if ($auth.isAuthenticated() && next.onBoard) {
            $location.path('/favorites');
        };
    });
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


app.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$location', '$auth','$state', function($scope, $rootScope, $http, $location, $auth, $state){

  $scope.search = function (s){
    $http.post(host+'/api/search/' + s.term, s)
      .then(function(response){
        $state.go('home');
        $rootScope.spots = response.data;
      });
  };

}]);

app.controller('HomeCtrl', ['$scope', '$rootScope', '$auth','$http', '$state', function($scope, $rootScope, $auth, $http, $state){
  //pass data from main controller
  $rootScope.spots = $scope.spots;
  //map
  $scope.$on('mapInitialized', function (event, map) {
            $scope.objMapa = map;
         });
  //info windows
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
  //check if user is authenticated
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
  //favorites
  $scope.favorites = function(spot) {
    if (_.findWhere(JSON.parse(localStorage.currentUser).favorites, {business_id: spot.id}) != undefined) {
      var temp = JSON.parse(localStorage.currentUser);
      var index = temp.favorites.indexOf(_.findWhere(JSON.parse(localStorage.currentUser).favorites, {business_id: spot.id}));
      temp.favorites.splice(index, 1);
      localStorage.setItem("currentUser", JSON.stringify(temp));     
       
      userid = JSON.parse(localStorage.currentUser)._id;
      $http.delete(host+'/api/'+userid+"/favorites", {id: spot.id})
        .then(function(response){
          console.log(response, "deleted success");
        });
    } else {
    userid = JSON.parse(localStorage.currentUser)._id;
      $http.put(host+'/api/'+userid+'/favorites', {id: spot.id})
        .then(function(response){
          var temp = JSON.parse(localStorage.currentUser);
          temp.favorites.push(response.data);
          localStorage.setItem("currentUser", JSON.stringify(temp));
        });
    };  
  };
  //check for favorites
  $scope.checkFavorites = function(spot) {
    if (_.findWhere(JSON.parse(localStorage.currentUser).favorites, {business_id: spot.id}) != undefined) {
      return "ion-ios-heart";
    } else {
      return "ion-ios-heart-outline";
    }
  }

}]);

app.controller('FavCtrl', ['$scope','$http', function($scope, $http) {
  $scope.favspots = [];

  var favArray = JSON.parse(localStorage.currentUser).favorites;
  _.each(favArray, function(bizId){
    $http.get(host+'/api/business/' + bizId.business_id)
      .then(function(response){
        $scope.favspots.push(response.data);
      });
  });

  $scope.favorites = function(spot) {
    if (_.findWhere(JSON.parse(localStorage.currentUser).favorites, {business_id: spot.id}) != undefined) {
      var temp = JSON.parse(localStorage.currentUser);
      var index = temp.favorites.indexOf(_.findWhere(temp.favorites, {business_id: spot.id}));
      temp.favorites.splice(index, 1);
      localStorage.setItem("currentUser", JSON.stringify(temp));

      userid = JSON.parse(localStorage.currentUser)._id;
      $http.delete(host+'/api/'+userid+"/favorites", {id: spot.id})
        .then(function(response){
          console.log(response, "deleted success");
        });
    } else {
      userid = JSON.parse(localStorage.currentUser)._id;
        $http.put(host+'/api/'+userid+'/favorites', {id: spot.id})
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
  };

}]);

app.controller('BizCtrl', ['$scope', '$rootScope', '$ionicModal', '$http', '$stateParams', '$cordovaGeolocation', function($scope, $rootScope, $ionicModal, $http, $stateParams, $cordovaGeolocation){
  $scope.work = [];
  $scope.spot = {};
  //get business info
  $http.get(host+'/api/business/' + $stateParams.id)
      .then(function(response){
        $scope.spot = response.data;
        console.log($scope.spot)
          //check location
          $scope.checkLocation = function(){
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
              $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                  var lat  = position.coords.latitude;
                  var long = position.coords.longitude;
                  console.log(position)

                  var spotCoord = {
                    latitude: $scope.spot.location.coordinate.latitude, 
                    longitude: $scope.spot.location.coordinate.longitude
                  }

                  console.log(spotCoord)
                  //check if user is close to location before letting them put in wait time
                    if (lat != spotCoord.latitude && long != spotCoord.longitude)
                      $scope.waitTime = function(business){
                        console.log(business);
                        $http.put(host+'/api/business/' + $stateParams.id, business)
                          .then(function(response){
                            console.log(response.data)
                            $scope.business = response.data;
                            $scope.modal.hide();
                          });
                        };
                    else 
                      alert("Sorry, you need to be at the location to add a wait time!");
                },
                function (err) {
                  alert('Please allow access to location to enter a wait time')
                });
          };
      });
  //commenting
  $scope.newComment = function(comment) {
    var postData = {comments: comment.content};

    $http.post(host+'/api/business/' + $stateParams.id +"/comments", postData)
      .then(function(response){
        $scope.work.push(response.data);
        console.log($scope.work);
      }, function(response) {
        console.log("error " + response)
      });
  };
  //modal for wait time
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

}]);

app.controller('LoginCtrl', ['$scope', '$rootScope', '$window', '$auth', '$location', function($scope, $rootScope, $window, $auth, $location){

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