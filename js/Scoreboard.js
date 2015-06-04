

var myApp = angular.module('myApp', []);
myApp.controller('baseballController', function($scope, $http,$q){
var baseball = [];
    $scope.game = null;
    $scope.daysGames = [];
    var d = new Date();
    var selectedDate = new Date(d);
    $scope.day = d.getDate();
    $scope.month = d.getMonth() + 1;
    $scope.year = d.getFullYear();
    $scope.total = 0;
    $scope.Joel = [];
    $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '435622', '592626', '592518', '457763'];
    $scope.idsToLookFor = [];
    $scope.myPichingStaff = 'lan';
    $scope.playersUpToBat = [];
    $scope.playersOnDeck = [];
    $scope.playersInTheHole = [];
    //  '592626', '570256', '457763', '543760', '471865',"475582"
//My Team
//'630111', '543829', '434670', '425783', '547989', '435622', '592626', '592518', '457763'
//Boston
//'456030', '434670', '120074', '435063', '593428', '467055', '605141', '596119', '628329'
//Phillies
//'519184', '425796', '400284', '429667', '596748', '605125', '520471', '434563'
//Reds
//'408252', '458015', '453943', '457803', '430910', '446359', '435401', '571740'
//Reds and Philles
//'519184', '425796', '400284', '429667', '596748', '605125', '520471', '434563', '408252', '458015', '453943', '457803', '430910', '446359', '435401', '571740'
    $scope.changeDate = function (value) {
        selectedDate.setDate(selectedDate.getDate() + value);
        $scope.day = selectedDate.getDate();
        $scope.month = selectedDate.getMonth() + 1;
        $scope.year = selectedDate.getFullYear();
        if ($scope.day < 10) {
            $scope.day = '0' + $scope.day;
        }
        if ($scope.month < 10) {
            $scope.month = '0' + $scope.month;
        }
        $scope. init();
    };
     $scope.gatherIds = function (id) {
         function lookup(name) {
                for (var i = 0, len = $scope.idsToLookFor.length; i < len; i++) {
                    if ($scope.idsToLookFor[i] === name) return true;
                }
                return false;
            }
            if (!lookup(id)) {
         $scope.idsToLookFor.push(id);
     }
     }
    $scope.getTotal = function () {
        angular.forEach($scope.idsToLookFor, function (id) {
            var score = parseInt($("#"+ id).text());

            function lookup(name) {
                for (var i = 0, len = $scope.Joel.length; i < len; i++) {
                    if ($scope.Joel[i].key === name) return true;
                }
                return false;
            }
            if(!(isNaN(score))){
                if (!lookup(id)) {
                        $scope.Joel.push({
                            key: id,
                            value: score
                    });
                    $scope.total += score;   
                }
            }
        });
        return $scope.total;
    };
    $scope.getScore = function (theIndex, x) {
        index = theIndex;

        var angi = parseInt(index);
        var score = ((((parseFloat(x.h)) - (parseFloat(x.d) + parseFloat(x.t) + parseFloat(x.hr))) * 1) + (parseFloat(x.d) * 2) + (parseFloat(x.t) * 3) + (parseFloat(x.hr) * 4) + (parseFloat(x.r) * 1) + (parseFloat(x.rbi) * 1) + (parseFloat(x.bb) * 1) + (parseFloat(x.sb) * 2) + (parseFloat(x.cs) * -1));
        return score;
    };
    $scope.getPitchingStaffScore = function (x) {
        var startingScore = 27;
        var pointsForHitsAndWalks = 0;
        var pointsForStrikeOuts = 0;
        var pointsForEarnedRuns = 0;
        var pointsForWin = 0;
        if (x._w == 1) {
            pointsForWin = 3;
        }
        if (x._k < 6 ) {
            pointsForStrikeOuts = 0;
        } else if (x._k > 5 && x._k < 8) {
            pointsForStrikeOuts = 1;
        } else if (x._k > 7 && x._k < 10) {
            pointsForStrikeOuts = 2;
        } else if (x._k > 9 && x._k < 13) {
            pointsForStrikeOuts = 3;
        } else if (x._k > 12 && x._k < 16) {
            pointsForStrikeOuts = 5;
        } else if (x._k > 14 && x._k < 20) {
            pointsForStrikeOuts = 7;
        } else {
            pointsForStrikeOuts = 10;
        }
        if (x._er == 0) {
            pointsForEarnedRuns = 7;
        } else if (x._er == 1) {
            pointsForEarnedRuns = 5;
        } else if (x._er == 2) {
            pointsForEarnedRuns = 3;
        } else if (x._er == 3) {
            pointsForEarnedRuns = 2;
        } else if (x._er == 4) {
            pointsForEarnedRuns = 1;
        } else if (x._er > 5) {
            pointsForEarnedRuns = 0;
        }
        var walksPlusHits = parseInt(x._bb) + parseInt(x._h);
        if (walksPlusHits == 0) {
            pointsForHitsAndWalks = 20;
        } else if (walksPlusHits == 1) {
            pointsForHitsAndWalks = 16;
        } else if (walksPlusHits == 2) {
            pointsForHitsAndWalks = 12;
        } else if (walksPlusHits == 3 || walksPlusHits == 4) {
            pointsForHitsAndWalks = 8;
        } else if (walksPlusHits > 4 && walksPlusHits < 8) {
            pointsForHitsAndWalks = 4;
        } else if (walksPlusHits > 7 && walksPlusHits < 11) {
            pointsForHitsAndWalks = 2;
        } else if (walksPlusHits > 10 && walksPlusHits < 13) {
            pointsForHitsAndWalks = 1;
        } else {
            pointsForHitsAndWalks = 0;
        }
        //alert("BB+H" + pointsForHitsAndWalks);
        //alert("ER" + pointsForEarnedRuns);
        //alert("K" + pointsForStrikeOuts);
        //alert("W" + pointsForWin);
        //alert(parseInt(pointsForHitsAndWalks) + parseInt(pointsForEarnedRuns) + parseInt(pointsForStrikeOuts) + parseInt(pointsForWin));
        pitchingScore = parseInt(pointsForHitsAndWalks) + parseInt(pointsForEarnedRuns) + parseInt(pointsForStrikeOuts) + parseInt(pointsForWin);
        $scope.total += pitchingScore;
        return pitchingScore;
    };
    $scope.numberInTheOrder = function (orderNumber) {
        if (orderNumber.charAt(1) === "0" && orderNumber.charAt(2) === "0") return orderNumber.charAt(0) + ".";
        else return "-";
    };
    
    $scope.init = function () {
        //$scope.changeDate(0);
        $scope.total = 0;
        $scope.idsToLookFor = [];
        $scope.Joel = [];
        baseball = [];
        $scope.daysGames = [];
        $scope.playersUpToBat = [];
        $scope.playersOnDeck = [];
        $scope.playersInTheHole = [];
        //alert($scope.month + "/" + $scope.day + "/" + $scope.year);
        $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/master_scoreboard.json';
        //alert($scope.scoreBoard);
        $http.get($scope.scoreBoard).success(function (data) {
            //alert("");
            //alert(data);
             angular.forEach(data.data.games.game, function (batter) {
                 var thisSession = batter;
               if(thisSession.hasOwnProperty('inhole')){
                    $scope.playersUpToBat.push(batter.batter.id);
                    $scope.playersOnDeck.push(batter.ondeck.id);
                    $scope.playersInTheHole.push(batter.inhole.id);
                }
             });

            angular.forEach(data.data.games.game, function (links) {
                var JSONlink = links.game_data_directory;

                $scope.daysGames.push('http://gd2.mlb.com' + JSONlink + "/boxscore.json");
            });
            //alert($scope.daysGames);
            angular.forEach($scope.daysGames, function (games) {
                $scope.game = $http.get(games);
                $q.all([$scope.game]).then(function (values) {

                    baseball.push(values);
                    $scope.baseballGame = baseball;
                    //$scope.reds = baseball[0][0].data.data.boxscore.batting;
                });
            });

        });
        $scope.pitchingStaff();
        $scope.getTotal();
    };
           $scope.pitchingStaff = function () {
           //alert("");
        $http.get('http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/'+ $scope.myPichingStaff+'_1.xml').success(function (data, status, headers, config) {
            var x2js = new X2JS();
            convertedData = x2js.xml_str2json(data.replace(/<!--[\s\S]*?-->/g, ""));
            $scope.pitchingStaffStats = convertedData.pitching;
            $scope.pitchingScore = $scope.getPitchingStaffScore($scope.pitchingStaffStats);
            $('#pitchingTable').show();
        }).
        error(function (data, status, headers, config) {
            $('#pitchingTable').hide();
            //alert("Error");
        });
    };    
});
