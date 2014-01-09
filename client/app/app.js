//'use strict';
app = angular.module('meteorapp', ['meteor', 'ui.bootstrap']);
// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
app.config([ '$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider )
{
    $routeProvider.
        when('/splash', {
            templateUrl: 'partials/splash.html',
            controller: 'SplashCtrl'
        }).
        when('/login', {
            templateUrl: 'partials/splash.html',
            controller: 'LoginCtrl'
        }).
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
            controller: 'DetailCtrl'
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
        when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl'
        }).
        when('/route/:user_id/:phase/:promise_id', {
            templateUrl: 'partials/splash.html',
            controller: 'RouteCtrl'
        }).
        otherwise({
            redirectTo: 'splash'
        });

    //$locationProvider.html5Mode( true );
}]);

sharedService = {};
sharedService.i18n = {};
//TO-DO delete user's attrs
sharedService.user = { name : 'hong', id : '+821067351365', email :'', photo : '' };
sharedService.route = 'promise';
sharedService.phase = 'my';
sharedService.promise_id = '1234567890';
sharedService.isWeb = false;
sharedService.isDirectRoute = false;
sharedService.data = {};

sharedService.i18nApply = function( ctrlName, scope )
{
    var map = sharedService.i18n[ctrlName];
    for ( var p in map )
        scope[p] = map[p];

    map = sharedService.i18n['common'];
    for ( p in map )
        scope[p] = map[p]
};

//for shared data among controllers
sharedService.appready = function( rootScope )
{
    rootScope.$broadcast('appready');
};

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

//for shared data among controllers
sharedService.showMenuBroadcast = function( rootScope )
{
    rootScope.$broadcast('showMenuBroadcast');
};
sharedService.hideMenuBroadcast = function( rootScope )
{
    rootScope.$broadcast('hideMenuBroadcast');
};

sharedService.notifyPomiseBroadcast = function( rootScope )
{
    rootScope.$broadcast('notifyPomiseBroadcast');
};

WayFliesFS = new CollectionFS('wayfiles', { autopublish: false });
//WayFliesFS.allow({
//    insert: function(userId, myFile) { return userId && myFile.owner === userId; },
//    update: function(userId, files, fields, modifier) {
//        return _.all(files, function (myFile) {
//            return (userId == myFile.owner);
//
//        });  //EO iterate through files
//    },
//    remove: function(userId, files) { return false; }
//});
//WayFliesFS.filter({
//    allow: {
//        contentTypes: ['image/*']
//    }
//});
