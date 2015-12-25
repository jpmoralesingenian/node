angular.module('encuesta.controllers', ['encuesta.services','ionic.rating'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MeserosCtrl', function($scope, $stateParams,Meseros,Locations) {
    Locations.get({"locationId":$stateParams.locationId}, function(loc) { 
	$scope.locattion = loc;
    	$scope.meseros = Meseros.query({"locattion_id":loc._id},function() {}, function(error) {console.log("There is an error "+JSON.stringify(error));});
    });
    

})
.controller('LocationsCtrl', function($scope, $stateParams, Locations) {
    console.log("On the LocationS controller");
    $scope.locattions = Locations.query({},function() {}, function(error) {console.log("There is an error "+JSON.stringify(error));});
})
.controller('LocationCtrl', function($scope, $state,Locations) {
    var onSuccess = function(position) {
	var locations = Locations.query({},function() {
		var minDistance = -1;
		var minLoc;
		var distance;
		locations.forEach(function (loc,index,array) {
			distance = Math.abs(position.coords.latitude - loc.latitude) + Math.abs(position.coords.longitude);
			if(minDistance== -1 || distance < minDistance) {
				minDistance = distance;
				minLoc = loc;		
			}
		});
		$scope.currentLocation = minLoc;
		$state.go('app.meseros',{"locationId":minLoc._id});	
	},function(error) {
		$state.go('app.locations');
		console.log("There is an error "+JSON.stringify(error));
	});

	};
	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    console.log('code: '    + error.code    + '\n' +
        	  'message: ' + error.message + '\n');
	}
	navigator.geolocation.getCurrentPosition(onSuccess, onError);

	
})
.controller('EncuestaCtrl', function($scope, $stateParams, Meseros) {
    $scope.rate=4;
    $scope.max =5;
    Meseros.get({"meseroId":$stateParams.meseroId}, function(mesero) { 
	$scope.mesero = mesero;
    });
})
.controller('EncuestaSendCtrl', ['$scope','Encuestas', function($scope, Encuestas) {
    //$scope.meseroId = $stateParams.meseroId;
    console.log("Comment is ["+ $scope.comment+ "] and rate is ["+ $scope.rate+"] ["+$scope.meseroId+"]");
    $scope.submit = function(mesero) {
	// Rate the guy using the factory
    	console.log("Submit function ["+ $scope.comment+ "] and rate is ["+ $scope.rate+"] ["+mesero._id+"]");
	Encuestas.save({score:$scope.rate,mesero: mesero,comments:$scope.comment}, function (){}, function (err) { console.log("Hay un error: "+ JSON.stringify(err));});
    }
}])
;
