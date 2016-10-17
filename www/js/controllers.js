projectmodule = angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicPopover, CartOperation) {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});



            // .fromTemplateUrl() method
            $ionicPopover.fromTemplateUrl('templates/cart_small.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });


            $scope.openPopover = function ($event) {
                $scope.popover.show($event);
            };
            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.popover.remove();
            });
            // Execute action on hide popover
            $scope.$on('popover.hidden', function () {
                // Execute action
            });
            // Execute action on remove popover
            $scope.$on('popover.removed', function () {
                // Execute action
            });

            $rootScope.cartdata = {'card_data': [], 'total_price': 0, 'total_quantity': 0};
            CartOperation.getCartDetail().then(function (data) {
                $rootScope.cartdata = data;
            })

            $rootScope.removeCart = function (product_id) {
                dal.executesql("delete from cart where product_id = '" + product_id + "'", function () {
                    CartOperation.getCartDetail().then(function (data) {
                        console.log(data);
                        $rootScope.cartdata = data;
                    })
                })
            }

        })



        .controller('OrderController', function ($scope, $ionicPopup, $rootScope, $http, CartOperation) {
            $scope.orderdata = [];
            $scope.$on('$ionicView.enter', function (e) {
                CartOperation.getOrderDetail().then(function (data) {
                    $scope.orderdata = data;
                })
            });

        })

        .controller('Cart', function ($scope, $ionicPopup, $rootScope, $http, CartOperation, $window) {
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = false;
            });
            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Your Order',
                    template: 'Are you sure you want to confirm this order?'
                });
                confirmPopup.then(function (res) {
                    if (res) {

                        $http.post(serverurl + "takeorder", $rootScope.cartdata).then(
                                function (response) {
                                    var order = response.data;
                                    dal.create('order_data', order);
                                    if (order.order_id > 0) {
                                        dal.executesql("update cart set order_id = " + order.order_id + " where order_id ='' ", function () {
                                            CartOperation.getCartDetail().then(function (data) {
                                                $rootScope.cartdata = data;
                                               $window.location = "#/app/orders"
                                            })

                                        })
                                    }
                                });
                    } else {
                        console.log('You are not sure');
                    }
                });
            };
        })

        .controller('ShowNow', function ($scope) {

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = false;
            });

            $scope.menu_items = [
                {
                    'title': 'Vegetables',
                    'image': 'vegetables.png',
                    'id': '1',
                    'description': 'Fresh & Best Quality Vegetables'
                },
                {
                    'title': 'Fruits',
                    'image': 'fruits.png',
                    'id': '2',
                    'description': 'Healthy Fruits For Your Health'
                },
                {
                    'title': 'Dry Fruits',
                    'image': 'dry_fruits.png',
                    'id': '3',
                    'description': 'Dried Fruit Is Highly Nutritious'
                },
                {
                    'title': 'Sprouts',
                    'image': 'sprouts.png',
                    'id': '4',
                    'description': 'Who Wants Dietary Fiber'
                },
            ]

        })


        .controller('ProductList', function ($scope, $rootScope, $stateParams, $http, $ionicModal, $ionicPopover, CartOperation) {
            $scope.menu_id = $stateParams.menuid;

            CartOperation.getCartDetail().then(function (data) {
                console.log(data, 'sdfsa ffa fda');
            }, function (e) {
                console.log(e);
            })
            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/product_detail.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeProduct = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.openProduct = function () {
                $scope.modal.show();
            };


            $scope.viewproduct = function (product) {
                $scope.product = product;
                $scope.openProduct();
            }


            $scope.menu_items = {
                '1':
                        {
                            'title': 'Vegetables',
                            'image': 'vegetables.png',
                            'id': '1',
                            'description': 'Fresh & Best Quality Vegetables'
                        },
                '2':
                        {
                            'title': 'Fruits',
                            'image': 'fruits.png',
                            'id': '2',
                            'description': 'Healthy Fruits For Your Health'
                        },
                '3': {
                    'title': 'Dry Fruits',
                    'image': 'dry_fruits.png',
                    'id': '3',
                    'description': 'Dried Fruit Is Highly Nutritious'
                },
                '4': {
                    'title': 'Sprouts',
                    'image': 'sprouts.png',
                    'id': '4',
                    'description': 'Who Wants Dietary Fiber'
                },
            };
            $scope.selectedmenu = $scope.menu_items[$scope.menu_id];

            $scope.products = [];
            $http.get(serverurl + "getProducts/" + $scope.menu_id).then(
                    function (r) {

                        $scope.products = r.data.products;
                    })
            $scope.addCard = function (product) {
                CartOperation.addToCart(product);
                CartOperation.getCartDetail().then(function (data) {
                    $rootScope.cartdata = data;
                })
            };

            $scope.increment = function (obj) {
                obj.quantity = Number(obj.quantity) + 1;
                console.log(obj);
            }

            $scope.decrement = function (obj) {
                if (Number(obj.quantity) > 1) {
                    obj.quantity = Number(obj.quantity) - 1;
                }
            }
        })