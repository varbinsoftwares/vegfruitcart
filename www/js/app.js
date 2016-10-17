// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//var serverurl = "http://192.168.1.11/qusans/api/index.php/"
var serverurl = "http://cdn.varbin.com/veg_fruit/api/"
angular.module('starter', ['ionic', 'ionicLazyLoad', 'starter.controllers', ])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs) #ef473a
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                    StatusBar.backgroundColorByHexString("#ef473a");
                }
            });
        })
        .config(['$httpProvider', function ($httpProvider) {
                //Reset headers to avoid OPTIONS request (aka preflight)
                $httpProvider.defaults.timeout = 5000;
                $httpProvider.defaults.headers.common = {};
                $httpProvider.defaults.headers.post = {};
                $httpProvider.defaults.headers.put = {};
                $httpProvider.defaults.headers.patch = {};
            }])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.search', {
                        url: '/search',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/search.html'
                            }
                        }
                    })
                    
                     .state('app.cart', {
                        url: '/cart',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cart_page.html',
                                 controller: 'Cart'
                            }
                        }
                    })

                    .state('app.orders', {
                        url: '/orders',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/order_page.html',
                                 controller: 'OrderController'
                            }
                        }
                    })
                    .state('app.shownow', {
                        url: '/shownow',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/shopnow.html',
                                controller: 'ShowNow'
                            }
                        }
                    })

                    .state('app.productlist', {
                        url: '/productlist/:menuid',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/productlist.html',
                                controller: 'ProductList'
                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/shownow');
        });


function init() {
    dal.dbopen("appdbt12");
    tablelist = {
        auth_user: ['name', 'mobile_no', 'password', 'user_id', 'verified'],
        cart: ['product_id','title', 'category_id', 'unit', 'price', 'image', 'quantity','order_id'],
        order_data: ['order_date', 'order_time', 'user_id', 'total_price', 'total_quantity', 'order_id']
    }


    dal.tables(tablelist);
}

init();