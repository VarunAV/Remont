angular.module('myApp', ['ngRoute', 'ngResource', 'ngStorage'])
  .config(['$routeProvider', function($routeProvider){
    var universalResolves = {
      "check": function($location, $sessionStorage) {
        if(!$sessionStorage.loggedIn) {
          $location.path('/');
        }
      }
    }
    var customRouteProvider = angular.extend({}, $routeProvider, {
   when: function(path, route) {
     route.resolve = (route.resolve) ? route.resolve : {};
     angular.extend(route.resolve, universalResolves);
     $routeProvider.when(path, route);
     return this;
   }
  });
    customRouteProvider
    .when('/', {
      templateUrl: 'static/partials/index.html',
      controller: 'indexController'
    })
    .when('/signup', {
      templateUrl: 'static/partials/signup.html',
      controller: 'signupController'
    })
    .when('/shop', {
      templateUrl: 'static/partials/shop.html',
      controller: 'shopController'
    })
    .when('/earn', {
      templateUrl: 'static/partials/earn.html',
      controller: 'earnController'
    })
    .when('/donate', {
      templateUrl: 'static/partials/donate.html',
      controller: 'donateController'
    })
    .when('/recycle', {
      templateUrl: 'static/partials/recycle.html',
      controller: 'recycleController'
    })
    .when('/logout', {
      templateUrl: 'static/partials/index.html',
      controller: 'logoutController'
    })
    .otherwise({
      redirectTo: '/'
      })
      $routeProvider
    .when('/signup', {
      templateUrl: 'static/partials/signup.html',
      controller: 'signupController'
      })
    .when('/login', {
        templateUrl: 'static/partials/login.html',
        controller: 'loginController'
      })
  }])
  .controller('indexController', ['$sessionStorage', '$scope', function($sessionStorage, $scope){
}])
.controller('shopController', ['$sessionStorage', '$scope', '$rootScope', '$http', function($sessionStorage, $scope, $rootScope, $http){
  $scope.user = $sessionStorage.user;
  $scope.data = $rootScope.data;
  $rootScope.loggedIn = true;
  $scope.buy1 = function() {
    var r = window.confirm("Do you want to buy this product for 35 leaves?");
      if (r & $scope.user['leaves'] - 35 > 0) {
      $scope.user['leaves'] = $scope.user['leaves'] - 35;
      alertify.alert("Congratulations! Your book will be shipped to you");
      var data = JSON.stringify({
      username: $scope.user['username'],
      leaves: $scope.user['leaves']
    });
    $http.post('/set_userLeaves', data).success(function(d){
        $sessionStorage.user = d[0];
        $rootScope.data = JSON.parse(data);
        $sessionStorage.user = $scope.user;
        $location.path('/recycle');
      });
    }
    else {
      alertify.alert("You do not have enough leaves to proceed with this transaction");
    }
  }
}])
.controller('logoutController',['$sessionStorage', '$scope', '$route', '$rootScope', function($sessionStorage, $scope, $route, $rootScope){
  $rootScope.loggedIn = false;
  $sessionStorage.loggedIn = false;
}])
.controller('loginController', ['$scope', '$http', '$location', '$rootScope', '$sessionStorage' ,function($scope, $http, $location, $rootScope, $sessionStorage){

  $scope.username = ""
  $scope.password = ""
  $scope.userid = ""
  $scope.sendPost = function() {
    var data = JSON.stringify({
        username: $scope.username,
        password: $scope.password
    });
    $http.post('/login', data).success(function(d){
        if(d == 'True') {
          $sessionStorage.user = $scope.username;
          alertify.alert('Login Successful');
          $rootScope.loggedIn = true;
          var data2 = $scope.username;
            $http.post('/get_user',data2).
              success(function(d) {
                var data3 = d[0]['leaves'];
                $sessionStorage.user = d[0];
                $rootScope.loggedIn = true;
                $sessionStorage.loggedIn = true;
                $sessionStorage.myVar2 = true;
                $sessionStorage.myVar = false;
                $location.path('/recycle');

              });
        }
        else {
          alertify.alert('Invalid Username or Password');
        }

      });
  }
}])
.controller('signupController', ['$scope', '$http', '$location','$sessionStorage', function($scope, $http, $location, $sessionStorage){
   $scope.mobile = ""
   $scope.username = ""
   $scope.password = ""
   $scope.password2 = ""
   $scope.sendPost = function() {
     var data = JSON.stringify({
         mobile: $scope.mobile,
         username: $scope.username,
         password: $scope.password,
         password2: $scope.password2
     });
     var data2 = JSON.parse(data);
     var mob = (data2['mobile'].toString()).length
     if(mob<10){
       alertify.alert("Enter a valid phone number");
       return false;
     }
     re = /[a-zA-Z0-9_]/

     if(data2['username']==undefined||!re.test(data2['username'])){
       alertify.alert("Enter valid username");
       return false;
     }
     re = /[a-zA-Z]/
     /*if(data2['first_name']==undefined||!re.test(data2['first_name'])){
       alertify.alert("Enter valid first name without space");
       return false;
     }
     if(data2['last_name']==undefined||!re.test(data2['last_name'])){
       alertify.alert("Enter valid last name without space");
       return false;
     }*/
     re= /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
     if(data2['password'].length<8&&!re.test(data2['password'])){
       alertify.alert("Invalid password add number and special charecters and min 8 charecters");
       return false;
     }
     if(data2['password'] !== data2['password2']) {
       alertify.alert("Both the password doesn't match");
       return false;
     }

     $http.post('/signup', data).success(function(d){
         $location.path('/login');
       });
      $sessionStorage.loggedIn = false;
   }
 }])
  .controller('earnController',['$rootScope', '$scope', '$sessionStorage', function($rootScope, $scope, $sessionStorage){
    $scope.user = $sessionStorage.user;
    $scope.data = $rootScope.data;
    $rootScope.loggedIn = true;

}])
  .controller('donateController',['$rootScope', '$scope', '$sessionStorage', function($rootScope, $scope, $sessionStorage){
    $scope.user = $sessionStorage.user;
    $scope.data = $rootScope.data;
    $rootScope.loggedIn = true;
}])
  .controller('recycleController', ['$rootScope', '$scope', '$location', '$sessionStorage','$http', function($rootScope, $scope, $location, $sessionStorage, $http){
    $scope.user = $sessionStorage.user;
    $rootScope.loggedIn = true;
    $scope.item = "";
    $scope.weight = "";
    $scope.leaves = "";
    $scope.address = "";

    $scope.earn = function() {
      if($scope.item == undefined | $scope.item == null | $scope.item == '') {
        alertify.alert("Please select the resource.");
      }
      else if($scope.weight == undefined | $scope.weight == null | $scope.weigth <= 0) {
        alertify.alert("Please enter a valid weight.");
      }
      else if($scope.address == undefined | $scope.address == null | $scope.address == '') {
        alertify.alert("Please enter a valid address.");
      }
      else {
        if($scope.item == "paper") {
          $scope.leaves = $scope.user['leaves'] + $scope.weight * 10
        }
        else if($scope.item == "cans"){
          $scope.leaves = $scope.user['leaves'] + $scope.weight * 1
        }
        else {
          $scope.leaves = $scope.user['leaves'] + $scope.weight * 1
        }
          var data = JSON.stringify({
          username: $scope.user['username'],
          item: $scope.item,
          weight: $scope.weight,
          leaves: $scope.leaves
        });
        $rootScope.earn = $scope.leaves;
        $http.post('/set_userLeaves', data).success(function(d){
            $sessionStorage.user = d[0];
            $rootScope.data = JSON.parse(data);
            $scope.user = $sessionStorage.user;
            $location.path('/earn');
          });
      }
    }
    $scope.donate = function() {
      if($scope.item == undefined | $scope.item == null | $scope.item=="") {
        alertify.alert("Please select the resource.");
        return false;
      }
      if($scope.weight == undefined | $scope.weight == null | $scope.weight <= 0) {
        alertify.alert("Please enter a valid weight.")
        return false;
      }
      else if($scope.address == undefined | $scope.address == null | $scope.address == '') {
        alertify.alert("Please enter a valid address.");
      }
      else {
        if($scope.item == "paper") {
          $scope.leaves = $scope.weight * 10
        }
        else if($scope.item == "cans"){
          $scope.leaves = $scope.weight * 1
        }
        else {
          $scope.leaves = $scope.weight * 1
        }
          var data = JSON.stringify({
          item: $scope.item,
          weight: $scope.weight,
          leaves: $scope.leaves
        });
        $rootScope.data = JSON.parse(data);
        $rootScope.donate = $scope.leaves;
        $scope.item = "";
        $scope.weight = "";
        $scope.leaves = "";
        $location.path('/donate');
      }
    }
}])
