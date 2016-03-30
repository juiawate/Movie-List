angular.module('MovieApp', []).controller('MovieCtrl', ['$scope', 'MovieService', function ($scope, MovieService) {
    MovieService.getConfiguration().success(function(res) {
        $scope.configuration = res;
    });

    MovieService.getCollection('528').success(function (res) {
        $scope.collection = res['parts'];
        $scope.movies = [];
        $scope.collection.forEach(function (c) {
            var movie = {};
            movie = c;
            MovieService.getMovieCredits(c.id).success(function (res) {
                movie.credits = res;
                movie.directors = getNamesByDept(movie.credits['crew'], 'department', 'Directing');
                movie.writers = getNamesByDept(movie.credits['crew'], 'department', 'Writing');
                movie.stars = '';
                movie.credits['cast'].forEach(function (c) {
                    return movie.stars === '' ? movie.stars = c.name : movie.stars = movie.stars + ', ' + c.name;
                });
                movie.credits['cast'].selectedStar = movie.credits['cast'][0];

                $scope.movies.push(movie);
            });
        });
    });

    $scope.getMovieDetails = function(id) {
        $scope.selectedMovie = $scope.movies.find(function (m) {
            return m['id'] === id;
        });
        $scope.selectedStar = $scope.selectedMovie.credits['cast'][0];
    };

    $scope.selectStar = function (id) {
        $scope.selectedStar = $scope.selectedMovie.credits['cast'].find(function (s) {
            return s['id'] === id;
        });
    };



    function getNamesByDept(data, dept, deptName) {
        var res = data.find(function(d) {
            return d[dept] === deptName;
        });
        return res.name;
    }

    /*MovieService.getMoviesByCategory('latest').success(function (res) {
        $scope.latest = res;
    });
    MovieService.getMoviesByCategory('popular').success(function (res) {
        $scope.popular = res;
    });
    MovieService.getMoviesByCategory('now_playing').success(function (res) {
        $scope.now_playing = res;
    });
    MovieService.getMoviesByCategory('top_rated').success(function (res) {
        $scope.top_rated = res;
    });
    MovieService.getMoviesByCategory('upcoming').success(function (res) {
        $scope.now_playing = res;
    });*/


}]).factory('MovieService', ['$http', function ($http) {
    var api_key = '7e240e4b64e6bc719f354171f3d62cc9';
    return {
        getConfiguration : function() {
            return $http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key);
        },
        getCollection: function(id) {
            return $http.get('https://api.themoviedb.org/3/collection/' + id + '?api_key=' + api_key);
        },
        getMovieCredits: function(id) {
            return $http.get('https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=' + api_key);
        },
        getMoviesByCategory: function(category) {
            return $http.get('https://api.themoviedb.org/3/movie/' + category + '?api_key=' + api_key);
        }
    };
}]);