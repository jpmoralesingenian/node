// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'encuesta' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'encuesta.controllers' is found in controllers.js
angular.module('encuesta', ['ionic', 'encuesta.controllers'])
.constant("CONFIGURATION",{
	"rest_url" : "http://api.joshuacafebar.com/",
	"image_url" : "http://api.joshuacafebar.com/"

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('geolocation', {
    url: '/',
    controller: 'LocationCtrl'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.meseros', {
      url: '/:locationId/meseros',
      views: {
        'menuContent': {
          templateUrl: 'templates/meseros.html',
          controller: 'MeserosCtrl'
        }
      }
    })
  .state('app.encuesta', {
     url: '/encuesta/:meseroId',
     views: {
	'menuContent' : {
	   templateUrl: 'templates/encuesta.html',
	   controller: 'EncuestaCtrl'
	}
    }
   })
  .state('app.locations', {
    url: '/locations',
    views: {
      'menuContent': {
        templateUrl: 'templates/locations.html',
        controller: 'LocationsCtrl'
      }
    }
  })
  .state('app.thankyou', {
   url: '/thankyou',
   views: {
      'menuContent': {
        templateUrl: 'templates/gracias.html',
	controller: 'AppCtrl'
      }
   }
  })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
