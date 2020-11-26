/**
 * Created by Deb on 8/20/2014.
 */
(function () {
    "use strict";
    var app = angular.module("productManagement",
        ["common.services",
            "ui.router",
            "ui.mask",
            "ui.bootstrap",
            "angularCharts",
            "productResourceMock"]);
            
    app.filter("category", function(){
        return function(category){
            switch(category){
                case 1:
                    return "Garden";
                case 2:
                    return "Toolbox";
                case 3: 
                    return "Gaming";
                
            }
        }
    })

    app.directive("randomPicture", [function () {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                title: '='
            },
            template: '<h2>{{title}}</h2><br><img ng-src="{{items[random].imageUrl}}">',
            controller: function ($scope) {
                $scope.random = Math.floor(Math.random() * 5);
            }
        }
    }])


    app.config(function ($provide) {
        $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate) {
            return function (exception, cause) {
                exception.message = "Please contact the Help Desk! \n Message: " + exception.message;

                $delegate(exception, cause);
                alert(exception.message);
            }
        }])
    })

    app.config(["$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state("home", {
                    url: "/",
                    templateUrl: "app/welcomeView.html",
                    controller: "welcomeViewCtrl",
                    resolve: {
                        productResource: "productResource",

                        products: function (productResource) {
                            return productResource.query(function (response) { }, function (response) {
                                if (response.status == 404) {
                                    alert("Error accessing resource: " + response.config.method + " " + response.config.url);
                                }
                                else {
                                    alert(response.statusText);
                                }
                            }).$promise;
                        }
                    }
                })
                // Products
                .state("productList", {
                    url: "/products",
                    templateUrl: "app/products/productListView.html",
                    controller: "ProductListCtrl as vm"
                })
                .state("productEdit", {
                    abstract: true,
                    url: "/products/edit/:productId",
                    templateUrl: "app/products/productEditView.html",
                    controller: "ProductEditCtrl as vm",
                    resolve: {
                        productResource: "productResource",

                        product: function (productResource, $stateParams) {
                            var productId = $stateParams.productId;
                            return productResource.get({ productId: productId }).$promise;
                        }
                    }
                })
                .state("productEdit.info", {
                    url: "/info",
                    templateUrl: "app/products/productEditInfoView.html"
                })
                .state("productEdit.price", {
                    url: "/price",
                    templateUrl: "app/products/productEditPriceView.html"
                })
                .state("productEdit.tags", {
                    url: "/tags",
                    templateUrl: "app/products/productEditTagsView.html"
                })

                .state("productDetail", {
                    url: "/products/:productId",
                    templateUrl: "app/products/productDetailView.html",
                    controller: "ProductDetailCtrl as vm",
                    resolve: {
                        productResource: "productResource",

                        product: function (productResource, $stateParams) {
                            var productId = $stateParams.productId;
                            return productResource.get({ productId: productId }).$promise;
                        }
                    }
                })
                .state("priceAnalytics", {
                    url: "/priceAnalytics",
                    templateUrl: "app/prices/priceAnalyticsView.html",
                    controller: "PriceAnaltyicsCtrl",
                    resolve: {
                        productResource: "productResource",

                        products: function (productResource) {
                            return productResource.query(function (response) { }, function (response) {
                                if (response.status == 404) {
                                    alert("Error accessing resource: " + response.config.method + " " + response.config.url);
                                }
                                else {
                                    alert(response.statusText);
                                }
                            }).$promise;
                        }
                    }
                })


        }]
    );

}());