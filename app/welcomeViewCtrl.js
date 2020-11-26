(function(){

    angular.module("productManagement")
        .controller("welcomeViewCtrl", ["productResource","$scope", welcomeViewCtrl]);

    function welcomeViewCtrl(productResource, $scope){
        
        

        productResource.query(function(data) {
            $scope.products = data;
        });
    }

}());