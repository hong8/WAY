//'use strict';

app = angular.module('meteorapp', ['meteor']);

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
app.config([ '$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/my', {
            templateUrl: 'partials/my.html',
            controller: 'MyCtrl'
        }).
        when('/new', {
            templateUrl: 'partials/new.html',
            controller: 'NewCtrl'
        }).
        when('/credit', {
            templateUrl: 'partials/credit.html',
            controller: 'CreditCtrl'
        }).
        when('/promise/:promise_id', {
            templateUrl: 'partials/new.html',
            controller: 'PromiseDetailCtrl'
        }).
        when('/chat/:promise_id', {
            templateUrl: 'partials/chat.html',
            controller: 'ChatCtrl'
        }).
        when('/vote/:promise_id', {
            templateUrl: 'partials/vote.html',
            controller: 'VoteCtrl'
        }).
        when('/alarm/:promise_id', {
            templateUrl: 'partials/alarm.html',
            controller: 'AlarmCtrl'
        }).
        when('/location/:promise_id', {
            templateUrl: 'partials/location.html',
            controller: 'LocationCtrl'
        }).
        otherwise({
            redirectTo: 'my'
        });
}]);

sharedService = {};
sharedService.route = 'promise';
sharedService.phase = 'my';
sharedService.data = {};
//for menu
sharedService.selectMenuBroadcast = function( phase, rootScope )
{
    sharedService.phase = phase;
    rootScope.$broadcast('selectMenuBroadcast')
};

//for shared data among controllers
sharedService.dataBroadcast = function( data, rootScope )
{
    sharedService.data = data;
    rootScope.$broadcast('dataBroadcast');
};
