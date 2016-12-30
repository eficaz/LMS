// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova' ,'starter.controllers' , 'starter.services', 'ngOpenFB'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // Disable BACK button on home
  	$ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: 'System warning',
        template: 'are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);



  });



})

/////////////////timer count down////////////////////
.directive('countdown', [
        'Util',
        '$interval',
        function (Util, $interval) {
            return {
                restrict: 'A',
                scope: { date: '@',startdate:'@',onTimeEnd: '&?',boolStop:'=ngModel' },
                link: function (scope, element) {
                    var future,startdate;
                    var stop;
                    future = new Date(scope.date);
                    startdate= new Date(scope.startdate);
                    
                    var diff='';
                    stop=$interval(function () {

                       
                       
					if(diff=='')
                        diff = Math.floor((future.getTime() - startdate.getTime()) / 1000);
                    else
                    	diff=--diff;
                       
                        if(diff<=0)
                        {

                        	scope.onTimeEnd();
                      	}
                        return element.text(Util.dhms(diff));
                    }, 1000);
                    function stopFight() {
                      if (angular.isDefined(stop)) {
                        $interval.cancel(stop);
                        stop = undefined;
                      }
                    };
                    scope.$watch('boolStop', function(oldValue, newValue) {
                           
                            if(!scope.boolStop) 
                            stopFight();
                        
                        });                
                }
            };
        }
    ]).factory('Util', [function () {
    	
            return {
                dhms: function (t) {
                    var days, hours, minutes, seconds;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;
                    return [
                        days + 'd',
                        hours + 'h',
                        minutes + 'm',
                        seconds + 's'
                    ].join(' ');
                }
            };
        }])




.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom'); //bottom
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

//--------------------------------------

 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signin.html'
      }
    },
	authStatus: false
  })
 .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signup.html',
      }
   },
	authStatus: false
  })
//--------------------------------------


  .state('app.dashboard', {
    url: '/dashboard',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
		controller: 'DashboardCtrl'
      }
     },
	 authStatus: true
  })

  .state('app.interviews', {
    url: '/interviews',
    views: {
      'menuContent': {
        templateUrl: 'templates/interviews.html',
    	controller: 'InterviewCtrl'
      }
     },
   authStatus: true
  })


    .state('app.profiles', {
      url: '/profiles',
      views: {
        'menuContent': {
          templateUrl: 'templates/profiles.html',
          controller: 'ProfilesCtrl'
        }
      }
    })

  .state('app.profile', {
    url: '/profile/:profileId',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-detail.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.course', {
    url: '/coursedetail',
    views: {
      'menuContent': {
        templateUrl: 'templates/coursedetail.html',
        controller: 'InterviewCtrl'
      }
    }
  })
  .state('app.questions', {
    url: '/questions',
    views: {
      'menuContent': {
        templateUrl: 'templates/questions.html',
        controller: 'QuestionCtrl'
      }
    }
  })
 .state('app.reply', {
    url: '/reply/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/reply.html',
        controller: 'DashCtrl'
      }
     },
   authStatus: true
  });
  // if none of the above states are matched, use this as the fallback
  if (localStorage.getItem("cloudUser") != null) 
  {

    $urlRouterProvider.otherwise('/app/dashboard', {}, {reload: true});

  }
  else
  {
  $urlRouterProvider.otherwise('/app/login');
  }
});
