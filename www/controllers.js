angular.module('map', ['rwdImageMaps'])
.controller('MapCtrl', function($scope){
  $scope.myTrigger = function(arg){
    alert(arg + ' clicked');
  }
});

