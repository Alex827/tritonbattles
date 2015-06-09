var app = angular.module('searchApp', []);

app.controller('SetsController', function($http, $scope) {
  $scope.tags = QueryString.tags;
  $scope.showResults = false;
  //if($scope.tags != '') {
    $http.get('/api/searchcards?tags=' + [QueryString.tags]).success(function(response) {
      console.log("Query: "+ $scope.tags);
      console.log(response);
      $scope.cards = response;
      if($scope.cards.length != 0) {
        $scope.showResults = true;
      }
    });
  //}
});

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
    return query_string;
} ();

$(document).ready( function() {
    var $studyLink = $("#studyBtn").attr("href");
    var $challengeLink = $("#challengeBtn").attr("href");
    $("#studyBtn").attr("href", $studyLink + QueryString.tags);
    $("#challengeBtn").attr("href", $challengeLink + QueryString.tags);
});
