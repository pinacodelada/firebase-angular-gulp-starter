"use strict";

angular.module('myApp.routes', ['ngRoute'])

    // configure views; the authRequired parameter is used for specifying pages
    // which should only be available while logged in
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        });

        $routeProvider.when('/chat', {
            templateUrl: 'chat.html',
            controller: 'ChatCtrl'
        });

        $routeProvider.when('/account', {
            authRequired: true, // must authenticate before viewing this page
            templateUrl: 'account.html',
            controller: 'AccountCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
        });

        $routeProvider.when('/customers', {
            templateUrl: 'customers.html',
            controller: 'CustomerCtrl'
        });

        $routeProvider.when('/customers/new', {
            templateUrl: 'customer.html',
            controller: 'CustomerCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/home'});

        //$locationProvider.html5Mode(true);
    }]);