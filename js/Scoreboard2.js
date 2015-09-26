function blink() {
    var blinks = document.getElementsByTagName('blink');
    for (var i = blinks.length - 1; i >= 0; i--) {
        var s = blinks[i];
        s.style.visibility = (s.style.visibility === 'visible') ? 'hidden' : 'visible';
    }
    window.setTimeout(blink, 1000);
}
if (document.addEventListener) document.addEventListener("DOMContentLoaded", blink, false);
else if (window.addEventListener) window.addEventListener("load", blink, false);
else if (window.attachEvent) window.attachEvent("onload", blink);
else window.onload = blink;

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

var myApp = angular.module('myApp', []);
myApp.factory("poollingFactory", function($timeout) {
    var timeIntervalInSec = 1;

    function callFnOnInterval(fn, timeInterval) {
        var promise = $timeout(fn, 7000 * timeIntervalInSec);
        return promise.then(function() {
            callFnOnInterval(fn, timeInterval);
        });
    };
    return {
        callFnOnInterval: callFnOnInterval
    };
});
myApp.controller('baseballController', function($scope, $http, $q, $timeout, poollingFactory) {
    var baseball = [];
    $scope.baseballGame = null;
    $scope.game = null;
    $scope.daysGames = [];
    var d = new Date();
    var selectedDate = new Date(d);
    var mondayDateHelper = new Date(selectedDate);
    $scope.todaysDate = d.toString('M/d/yyyy');
    $scope.currentSelectedDate = selectedDate.toString('M/d/yyyy');
    $scope.day = d.getDate();
    $scope.month = d.getMonth() + 1;
    $scope.year = d.getFullYear();
    $scope.total = 0;
    $scope.pointsPerPlayerID = [];
    $scope.myTeam = [];
    $scope.benchPlayers = [];
    $scope.opponentsTeam = ['519390', '543333', '456030', '607054', '408314', '460576', '430945', '493114', '451594'];
    $scope.selectedTeam = [];
    $scope.idsToLookFor = [];
    $scope.myPitchingStaff = 'lan';
    $scope.playersUpToBat = [];
    $scope.playersOnDeck = [];
    $scope.playersInTheHole = [];
    $scope.eachGame = null;
    $scope.doubleHeader = false;
    $scope.pitchingStaffTeamName = null;
    $scope.pitchingStaffGames = [];
    $scope.allPitchingStaffGames = [];
    $scope.topOrBottom = null;
    $scope.inning = null;
    $scope.whichTeam = null;
    $scope.totalBattingPoints = 0;
    $scope.lastMonday = mondayDateHelper.previous().monday().toString('M/d/yyyy');
    $scope.lastSunday = mondayDateHelper.previous().sunday().toString('M/d/yyyy');
    $scope.nextMonday = mondayDateHelper.next().monday().toString('M/d/yyyy');
    $scope.nextSunday = mondayDateHelper.next().sunday().toString('M/d/yyyy');
    $scope.mlbTeamIDs = [145, 143, 113, 144, 147, 120, 141, 114, 119, 115, 118, 142, 109, 133, 136, 134, 110, 116, 111, 146, 121, 139, 112, 140, 117, 158, 138, 108, 135, 137];
    $scope.buttonText = "Show Bench";
    $scope.injuryData = [];
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
    //Ian Desmond 
    //'435622'
    poollingFactory.callFnOnInterval(function() {
        //console.log("1---" + 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/master_scoreboard.json');
        $scope.daysActiveGames = [];
        $scope.playersUpToBat2 = [];
        $scope.playersOnDeck2 = [];
        $scope.playersInTheHole2 = [];
        var baseball2 = [];
        $scope.baseballGame2 = null;
        $scope.doubleHeader = false;
        //$scope.baseballGame = null;
        $scope.setTheDate(false);
        //console.log('http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/master_scoreboard.json');
        $http.get('http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/master_scoreboard.json').success(function(data, status) {
            //console.log("2");
            $scope.eachGameRefresh = data.data.games.game;
            angular.forEach($scope.eachGameRefresh, function(game) {
                //console.log("3" + JSON.stringify(game));
                if (game.hasOwnProperty('inhole')) {
                    //console.log("4");
                    $scope.playersUpToBat2.push(game.batter.id);
                    $scope.playersOnDeck2.push(game.ondeck.id);
                    $scope.playersInTheHole2.push(game.inhole.id);
                    //console.log($scope.playersUpToBat);
                };
                if (game.hasOwnProperty('game_data_directory')) {
                    $scope.daysActiveGames.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
                };
                if (game.double_header_sw != 'N') {
                    if (game.away_code == $scope.myPitchingStaff || game.home_code == $scope.myPitchingStaff) {
                        $scope.doubleHeader = true;
                    };
                };
            });
            $scope.playersUpToBat = [];
            $scope.playersUpToBat = $scope.playersUpToBat2;
            $scope.playersOnDeck = [];
            $scope.playersOnDeck = $scope.playersOnDeck2;
            $scope.playersInTheHole = [];
            $scope.playersInTheHole = $scope.playersInTheHole2;

            angular.forEach($scope.daysActiveGames, function(games) {
                //console.log("1");
                $scope.game = $http.get(games);
                $q.all([$scope.game]).then(function(values) {
                    //console.log("2");
                    //baseball2.push(values);
                    //console.log("EnD HeRe");
                });
                //$scope.baseballGame2 = baseball2;
            });
            //$scope.baseballGame = $scope.baseballGame2;
            //console.log(baseball2);
        }).error(function(data, status) {
            console.log(data);
            console.log(status);
        });
        //$scope.baseballGame = $scope.baseballGame2;
        $scope.pitchingStaffGames = [];
        $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_1.xml';
        $scope.pitchingStaffGames.push($scope.game1);
        //console.log($scope.doubleHeader);
        if ($scope.doubleHeader) {
            $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
            $scope.pitchingStaffGames.push($scope.game2);
        };
        angular.forEach($scope.pitchingStaffGames, function(pitching) {
            $scope.pitchingGame = $http.get(pitching);
            $q.all([$scope.pitchingGame]).then(function(data) {

                var x2js = new X2JS();
                convertedData = x2js.xml_str2json(data[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                $scope.pitchingStaffStats = convertedData.pitching;
                //console.log($scope.pitchingStaffStats);
                //console.log($scope.allPitchingStaffGames);
                //console.log($scope.allPitchingStaffGames.indexOf($scope.pitchingStaffStats) == 0);
                //console.log($scope.allPitchingStaffGames.indexOf($scope.pitchingStaffStats));

                //if ($scope.allPitchingStaffGames.indexOf($scope.pitchingStaffStats) == 0) {
                $scope.allPitchingStaffGames = [];
                $scope.allPitchingStaffGames.push($scope.pitchingStaffStats);
                // console.log('Something Changed');
                //} else {
                //  console.log('Got here');
                //}
                $('#pitchingTable').show();
            });
        });
    })

    $scope.callThis = function(button) {
        if (button == 'Backwards') {
            $scope.changeDate(-1, false);
            $('#MyScoreboard')[0].contentWindow.document.getElementById("dateBack").click();
            $('#OpponentScoreboard')[0].contentWindow.document.getElementById("dateBack").click();
        } else if (button == 'Forward') {
            $scope.changeDate(1, false);
            $('#MyScoreboard')[0].contentWindow.document.getElementById("dateForward").click();
            $('#OpponentScoreboard')[0].contentWindow.document.getElementById("dateForward").click();
        } else {
            $scope.backToTodaysDate();
            $('#MyScoreboard')[0].contentWindow.document.getElementById("dateToday").click();
            $('#OpponentScoreboard')[0].contentWindow.document.getElementById("dateToday").click();
        }
    };

    $scope.findMyTeam = function(team) {
        $scope.whichTeam = team;
        var theSelectedDate = parseDate(selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate());
        if ($scope.whichTeam == "Mine") {
            if (theSelectedDate.between(parseDate('2015-09-21'), parseDate('2015-09-27'))) {
                //alert("PLAYOFFS");
                $scope.myTeam = ["457763", "547989", "547989", "543829", "592518", "435622", "425783", "471865", "570256", "598265"];
                $scope.benchPlayers = ["425877", "431151", "457759", "475582", "592626", "630111"];
                $scope.DLPlayers = ["434670"];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-09-14'), parseDate('2015-09-20'))) {
                //alert("Welcome Jackie");
                $scope.myTeam = ['457763', '547989', '543829', '570256', '592518', '435622', '425783', '471865', '598265'];
                $scope.benchPlayers = ['434670', '457759', '630111', '425877', '592626', '475582'];
                $scope.DLPlayers = ['431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-09-07'), parseDate('2015-09-13'))) {
                //alert("no more Yadi");
                $scope.myTeam = ['457763', '547989', '543829', '570256', '592518', '435622', '475582', '425783', '471865'];
                $scope.benchPlayers = ['434670', '457759', '630111', '425877', '285078', '592626', '435062', '608365'];
                $scope.DLPlayers = ['431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-08-31'), parseDate('2015-09-06'))) {
                //alert("Same Team two weeks in a row");
                $scope.myTeam = ['425877', '547989', '543829', '570256', '592518', '435622', '475582', '425783', '471865'];
                $scope.benchPlayers = ['434670', '457759', '630111', '457763', '285078', '592626', '435062'];
                $scope.DLPlayers = ['431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-08-24'), parseDate('2015-08-30'))) {
                //alert("Playoff Push");
                $scope.myTeam = ['425877', '547989', '543829', '570256', '592518', '435622', '475582', '425783', '471865'];
                $scope.benchPlayers = ['434670', '457759', '630111', '457763', '285078', '592626'];
                $scope.DLPlayers = ['431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-08-17'), parseDate('2015-08-23'))) {
                //alert("Playoff Push");
                $scope.myTeam = ['457763', '547989', '543829', '570256', '592518', '435622', '475582', '425783', '471865'];
                $scope.benchPlayers = ['434670', '457759', '630111', '425877', '285078', '592626'];
                $scope.DLPlayers = ['431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-08-10'), parseDate('2015-08-16'))) {
                //alert("I need a win!!!");
                $scope.myTeam = ['457763', '547989', '543829', '475582', '592518', '435622', '285078', '425783', '471865'];
                $scope.benchPlayers = ['434670', '425567', '630111', '425877', '570256', '592626'];
                $scope.DLPlayers = ['457759', '431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-08-03'), parseDate('2015-08-09'))) {
                //alert("Josh Hamilton");
                $scope.myTeam = ['457763', '547989', '543829', '434670', '592518', '435622', '285078', '425783', '471865'];
                $scope.benchPlayers = ['475582', '425567', '630111', '425877', '570256', '592626'];
                $scope.DLPlayers = ['457759', '431151']
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-07-27'), parseDate('2015-08-02'))) {
                //alert("Week After Cruse");
                $scope.myTeam = ['457763', '547989', '543829', '434670', '592518', '435622', '425567', '425783', '471865'];
                $scope.benchPlayers = ['457759', '285078', '630111', '425877', '570256', '592626'];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-07-20'), parseDate('2015-07-26'))) {
                //alert("Cruse Week");
                $scope.myTeam = ['457763', '547989', '457759', '434670', '592518', '285078', '425567', '630111', '570256'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-07-17'), parseDate('2015-07-19'))) {
                //alert("ALL STAR BREAK WEEK");
                $scope.myTeam = ['425567', '570256', '471865', '434670', '547989', '425877', '457759', '592518', '457763'];
                $scope.benchPlayers = ['630111', '435622', '425783', '285078', '570256', '543829'];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-07-06'), parseDate('2015-07-12'))) {
                //alert("IAN && CARGO");
                $scope.myTeam = ['425783', '543829', '471865', '434670', '547989', '425877', '592626', '592518', '457763'];
                $scope.benchPlayers = ['630111', '435622', '425567', '285078', '570256', '543760'];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-06-29'), parseDate('2015-07-05'))) {
                //alert("IAN && CARGO");
                $scope.myTeam = ['630111', '543829', '471865', '435622', '547989', '425877', '592626', '592518', '457763'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-06-22'), parseDate('2015-06-28'))) {
                //alert("YADI");
                $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '425877', '592626', '592518', '457763'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-06-15'), parseDate('2015-06-21'))) {
                //alert("CARGO");
                $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '471865', '592626', '592518', '457763'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-06-08'), parseDate('2015-06-14'))) {
                //alert("IAN");
                $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '435622', '592626', '592518', '457763'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-06-01'), parseDate('2015-06-07'))) {
                //alert("IAN");
                $scope.myTeam = [];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else if (theSelectedDate.between(parseDate('2015-05-25'), parseDate('2015-05-31'))) {
                //alert("IAN");
                $scope.myTeam = [];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'lan';
            } else {
                //alert("DEFUALT");
                $scope.myTeam = [];
                $scope.myPitchingStaff = '';
            }
            $scope.selectedTeam = $scope.myTeam;
        } else {
            if (theSelectedDate.between(parseDate('2015-09-21'), parseDate('2015-09-27'))) {
                //alert("PLAYOFFS WEEK 1");
                $scope.myTeam = ["518595", "502671", "543685", "592178", "608365", "461314", "518792", "605141", "572122"];
                $scope.benchPlayers = ["141", "425509", "446308", "474832", "607680", "621043"];
                $scope.DLPlayers = ["519317"];
                $scope.myPitchingStaff = 'sea';
            } else if (theSelectedDate.between(parseDate('2015-09-14'), parseDate('2015-09-20'))) {
                //alert("WEEK24");
                $scope.myTeam = ['471083', '405395', '435079', '461858', '430947', '429665', '460086', '572041', '594809'];
                $scope.benchPlayers = ['443558', '276519', '435263', '467827', '543281', '458731'];
                $scope.myPitchingStaff = 'ana';
            } else if (theSelectedDate.between(parseDate('2015-09-07'), parseDate('2015-09-13'))) {
                //alert("WEEK23");
                $scope.myTeam = ['467793', '408234', '572821', '134181', '628356', '453568', '456715', '121347', '150029'];
                $scope.benchPlayers = ['457727', '545341', '453056', '514917', '518692'];
                $scope.DLPlayers = ['452254', '407893'];
                $scope.myPitchingStaff = 'cle';
            } else if (theSelectedDate.between(parseDate('2015-08-31'), parseDate('2015-09-06'))) {
                //alert("WEEK22");
                $scope.myTeam = ['519083', '408236', '514888', '572761', '453064', '516782', '493316', '571740', '435522'];
                $scope.benchPlayers = ['593428', '457775', '547982', '474892', '592885'];
                $scope.myPitchingStaff = 'sfn';
            } else if (theSelectedDate.between(parseDate('2015-08-24'), parseDate('2015-08-30'))) {
                //alert("Week21");
                $scope.myTeam = ['465041', '425902', '518934', '518626', '452678', '457708', '624585', '136860', '453943'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'sln';
            } else if (theSelectedDate.between(parseDate('2015-08-17'), parseDate('2015-08-23'))) {
                //alert("Week20");
                $scope.myTeam = ['656941', '543333', '622110', '593934', '444876', '430945', '444482', '451594', '120074'];
                $scope.benchPlayers = ['408314', '434158', '434778', '460576', '502110', '546318'];
                $scope.DLPlayers = ['456030', '605412']
                $scope.myPitchingStaff = 'nyn';
            } else if (theSelectedDate.between(parseDate('2015-08-10'), parseDate('2015-08-16'))) {
                //alert("Week19");
                $scope.myTeam = ['446308', '502671', '543685', '592178', '621043', '461314', '474832', '518792', '572122'];
                $scope.benchPlayers = ['425509', '592663', '596059', '607680', '608365'];
                $scope.myPitchingStaff = 'tor';
            } else if (theSelectedDate.between(parseDate('2015-08-03'), parseDate('2015-08-09'))) {
                //alert("Week18");
                $scope.myTeam = ['467092', '430832', '429664', '571448', '493351', '455976', '460075', '519184', '400121'];
                $scope.benchPlayers = ['445988', '501981', '543939', '572008', '594828'];
                $scope.myPitchingStaff = 'pit';
            } else if (theSelectedDate.between(parseDate('2015-07-27'), parseDate('2015-08-02'))) {
                //alert("Week17");
                $scope.myTeam = ['430910', '519203', '408252', '446334', '462101', '457705', '457803', '444432', '543434'];
                $scope.benchPlayers = ['502517', '456714', '456665', '425900', '519058'];
                $scope.myPitchingStaff = 'tba';
            } else if (theSelectedDate.between(parseDate('2015-07-20'), parseDate('2015-07-26'))) {
                //alert("Week16");
                $scope.myTeam = ['518735', '458015', '543401', '448801', '543063', '488726', '547180', '545361', '502210'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'oak';
            } else if (theSelectedDate.between(parseDate('2015-07-17'), parseDate('2015-07-19'))) {
                //alert("WEEK15");
                $scope.myTeam = ['435263', '405395', '435079', '461858', '276519', '443558', '458731', '572041', '594809'];
                $scope.benchPlayers = [];
                $scope.benchPlayers = ['429665', '452655', '430947', '471083', '467827', '571788'];
                $scope.myPitchingStaff = 'ana';
            } else if (theSelectedDate.between(parseDate('2015-07-06'), parseDate('2015-07-12'))) {
                //alert("WEEK14");
                $scope.myTeam = ['467793', '407893', '572821', '121347', '514917', '453568', '456715', '542993', '457727'];
                $scope.benchPlayers = [];
                $scope.benchPlayers = ['517370', '408234', '518692', '452254', '592743'];
                $scope.myPitchingStaff = 'cle';
            } else if (theSelectedDate.between(parseDate('2015-06-29'), parseDate('2015-07-05'))) {
                //alert("WEEK13");
                $scope.myTeam = ['519083', '408236', '514888', '572761', '453064', '516782', '493316', '571740', '435522'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'sfn';
            } else if (theSelectedDate.between(parseDate('2015-06-22'), parseDate('2015-06-28'))) {
                //alert("WEEK12");
                $scope.myTeam = ['431145', '425902', '518934', '518626', '516770', '457708', '624577', '136860', '453943'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'sln';
            } else if (theSelectedDate.between(parseDate('2015-06-15'), parseDate('2015-06-21'))) {
                //alert("Week11");
                $scope.myTeam = ['519390', '543333', '456030', '607054', '408314', '460576', '430945', '493114', '451594'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'nyn';
            } else if (theSelectedDate.between(parseDate('2015-06-8'), parseDate('2015-06-14'))) {
                //alert("WEEK10");
                $scope.myTeam = ['446308', '502671', '543685', '592178', '425509', '518792', '461314', '519317', '572122'];
                $scope.benchPlayers = [];
                $scope.myPitchingStaff = 'sea';
            } else {
                //alert("IAN");
                $scope.myTeam = [];
                $scope.myPitchingStaff = '';
            }
            $scope.selectedTeam = $scope.myTeam;
        }
    };
    $scope.toggleBench = function() {
        $("#benchPlayers").toggle();
        if ($scope.buttonText == "Show Bench") {
            $scope.buttonText = "Hide Bench";
        } else {
            $scope.buttonText = "Show Bench";
        }
    };
    $scope.weeklyScores = function() {
        var dateToFindScores = new Date(selectedDate);
        $scope.getWeekRange();
        var currentDate = new Date(dateToFindScores);
        var mondaysDate = new Date($scope.StartDate);
        while (dateToFindScores >= mondaysDate) {
            //$scope.datesArray.push(dateToFindScores.toLocaleDateString());
            $scope.getEachDaysScores(dateToFindScores);
            $scope.addPitchingScoresToWeeklyScoreboard(dateToFindScores);
            dateToFindScores.setDate(dateToFindScores.getDate() - 1);
        }
    };
    $scope.getEachDaysScores = function(predate) {
        $scope.getWeekRange();
        $scope.findMyTeam($scope.whichTeam);

        $scope.MondaysScore = 0;
        $scope.TuesdaysScore = 0;
        $scope.WednesdayScore = 0;
        $scope.ThursdayScore = 0
        $scope.FridayScore = 0
        $scope.SaturdayScore = 0;
        $scope.SundayScore = 0;
        $scope.WeeksTotalScore = 0;
        $scope.baseballGame3 = null;
        $scope.datesArray = [];
        $scope.daysTotalForWeekly = 0;

        var date = new Date(predate);
        //console.log(date.toString("dddd"));
        $scope.dayloop = date.getDate();
        $scope.monthloop = date.getMonth() + 1;
        $scope.yearloop = date.getFullYear();
        if ($scope.dayloop < 10) {
            $scope.dayloop = '0' + $scope.dayloop;
        }
        if ($scope.monthloop < 10) {
            $scope.monthloop = '0' + $scope.monthloop;
        }
        //console.log($scope.monthloop + '-' + $scope.dayloop + '-' + $scope.yearloop);
        $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/master_scoreboard.json';
        //alert($scope.scoreBoard);
        $scope.getPoints($scope.scoreBoard, date);

    };
    $scope.getHittingStatLine = function(x) {
        $scope.hittingStatLine = x.h + ' - ' + x.ab + ' ,';
        if (x.d != 0) {
            $scope.hittingStatLine += ' ' + x.d + ' 2B ,';
        };
        if (x.t != 0) {
            $scope.hittingStatLine += ' ' + x.t + ' 3B ,';
        };
        if (x.hr != 0) {
            $scope.hittingStatLine += ' ' + x.hr + ' HR ,';
        };
        if (x.rbi != 0) {
            $scope.hittingStatLine += ' ' + x.rbi + ' RBI ,';
        };
        if (x.bb != 0) {
            $scope.hittingStatLine += ' ' + x.bb + ' BB ,';
        };
        if (x.r != 0) {
            $scope.hittingStatLine += ' ' + x.r + ' R ,';
        };
        if (x.sb != 0) {
            $scope.hittingStatLine += ' ' + x.sb + ' SB ,';
        };
        if (x.cs != 0) {
            $scope.hittingStatLine += ' ' + x.cs + ' CS ,';
        };
        $scope.hittingStatLine = $scope.hittingStatLine.substring(0, $scope.hittingStatLine.length - 1);
        return $scope.hittingStatLine;
    };

    $scope.getPitchingStatLine = function(x) {
        $scope.pitchingStatLine = '';
        if (x._w > 0) {
            $scope.pitchingStatLine = ' W ,';
        };
        if (x._l > 0) {
            $scope.pitchingStatLine = ' L ,';
        };
        if (x._ip != 0) {
            $scope.pitchingStatLine += ' ' + x._ip + ' IP ,';
        };
        if (x._h != 0) {
            $scope.pitchingStatLine += ' ' + x._h + ' H ,';
        };
        if (x._er != 0) {
            $scope.pitchingStatLine += ' ' + x._er + ' ER ,';
        };
        if (x._bb != 0) {
            $scope.pitchingStatLine += ' ' + x._bb + ' BB ,';
        };
        if (x._k != 0) {
            $scope.pitchingStatLine += ' ' + x._k + ' K ,';
        };
        if (x._sho != 0) {
            $scope.pitchingStatLine += ' ' + x._sho + ' SHO ,';
        };

        $scope.pitchingStatLine = $scope.pitchingStatLine.substring(0, $scope.pitchingStatLine.length - 1);
        return $scope.pitchingStatLine;
    };

    $scope.getPoints = function(master, dateOfDay) {
        //console.log(dateOfDay.toString("dddd"));
        $http.get(master).success(function(data) {
            $scope.eachGame3 = null;
            var baseball3 = [];
            $scope.daysGames3 = [];
            $scope.baseballGame3 = null;
            $scope.eachGame3 = data.data.games.game;
            angular.forEach($scope.eachGame3, function(gameInfo) {
                //$scope.doubleHeader = false;
                if (gameInfo.away_code == $scope.myPitchingStaff || gameInfo.home_code == $scope.myPitchingStaff) {
                    //console.log("Date: " + gameInfo.time_date);
                    //console.log("doubleHeader code: " + gameInfo.double_header_sw);
                    if (gameInfo.double_header_sw != 'N') {
                        $scope.doubleHeader = true;
                        // console.log("My Staff: " + $scope.myPitchingStaff);
                        // console.log("Away Staff: " + gameInfo.away_code);
                        // console.log("Home Staff: " + gameInfo.home_code);
                    };
                    //console.log("True or False? " + $scope.doubleHeader);
                };
                var JSONlink = gameInfo.game_data_directory;
                //alert('http://gd2.mlb.com' + JSONlink + "/boxscore.json");
                if ($scope.daysGames3.indexOf('http://gd2.mlb.com' + JSONlink + '/boxscore.json') == -1) {
                    $scope.daysGames3.push('http://gd2.mlb.com' + JSONlink + '/boxscore.json');
                    //console.log('http://gd2.mlb.com' + JSONlink + '/boxscore.json');
                };
            });
            $scope.baseballGame3 = null;
            baseball3 = [];
            //$scope.totalBattingPoints = 0;
            angular.forEach($scope.daysGames3, function(games) {
                $scope.game3 = null;
                $scope.game3 = $http.get(games);
                $q.all([$scope.game3]).then(function(values) {
                    angular.forEach(values, function(eachGame) {
                        var hittingBoxscore = eachGame.data.data.boxscore.batting;
                        angular.forEach(hittingBoxscore, function(eachTeamsBoxscore) {
                            var eachLineUp = eachTeamsBoxscore.batter;
                            angular.forEach(eachLineUp, function(eachBatter) {
                                if ($scope.selectedTeam.indexOf(eachBatter.id.toString()) > -1) {
                                    $scope.daysTotalForWeekly += parseFloat($scope.getScore(0, eachBatter));
                                    //console.log(eachBatter.id.toString() + '===' + parseFloat($scope.getScore(0, eachBatter)) '===' + $scope.daysTotalForWeekly);
                                    //
                                    //console.log($scope.daysTotalForWeekly);
                                    var theDate = new Date(dateOfDay);
                                    if (theDate.toString("dddd") == "Monday") {
                                        $scope.MondaysScore += parseFloat($scope.getScore(0, eachBatter));
                                    }
                                    if (theDate.toString("dddd") == "Tuesday") {
                                        $scope.TuesdaysScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    if (theDate.toString("dddd") == "Wednesday") {
                                        $scope.WednesdayScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    if (theDate.toString("dddd") == "Thursday") {
                                        $scope.ThursdayScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    if (theDate.toString("dddd") == "Friday") {
                                        $scope.FridayScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    if (theDate.toString("dddd") == "Saturday") {
                                        $scope.SaturdayScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    if (theDate.toString("dddd") == "Sunday") {
                                        $scope.SundayScore += parseFloat($scope.getScore(0, eachBatter));
                                    };
                                    $scope.WeeksTotalScore = $scope.MondaysScore + $scope.TuesdaysScore + $scope.WednesdayScore + $scope.ThursdayScore + $scope.FridayScore + $scope.SaturdayScore + $scope.SundayScore;
                                };
                            });
                        });
                    });
                });
            });
        });
    };
    $scope.addPitchingScoresToWeeklyScoreboard = function(dateOfDay) {
        var date = new Date(dateOfDay);
        $scope.dayloop = date.getDate();
        $scope.monthloop = date.getMonth() + 1;
        $scope.yearloop = date.getFullYear();
        if ($scope.dayloop < 10) {
            $scope.dayloop = '0' + $scope.dayloop;
        }
        if ($scope.monthloop < 10) {
            $scope.monthloop = '0' + $scope.monthloop;
        }
        $scope.pitchingStaffGamesTotals = [];
        $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/pitching_staff/' + $scope.myPitchingStaff + '_1.xml';
        $scope.pitchingStaffGamesTotals.push($scope.game1);
        //alert($scope.doubleHeader);
        //if ($scope.doubleHeader) {
        $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
        $scope.pitchingStaffGamesTotals.push($scope.game2);
        //alert("Got here");
        //};

        angular.forEach($scope.pitchingStaffGamesTotals, function(pitchingTotals) {
            $scope.pitchingGame = $http.get(pitchingTotals);
            $q.all([$scope.pitchingGame]).then(function(dataTotals) {

                var x2js = new X2JS();
                convertedData = x2js.xml_str2json(dataTotals[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                var gameTotal = $scope.getPitchingStaffScore(convertedData.pitching);
                if (date.toString("dddd") == "Monday") {
                    $scope.MondaysScore += $scope.getPitchingStaffScore(convertedData.pitching);
                }
                if (date.toString("dddd") == "Tuesday") {
                    $scope.TuesdaysScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                if (date.toString("dddd") == "Wednesday") {
                    $scope.WednesdayScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                if (date.toString("dddd") == "Thursday") {
                    $scope.ThursdayScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                if (date.toString("dddd") == "Friday") {
                    $scope.FridayScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                if (date.toString("dddd") == "Saturday") {
                    $scope.SaturdayScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                if (date.toString("dddd") == "Sunday") {
                    $scope.SundayScore += $scope.getPitchingStaffScore(convertedData.pitching);
                };
                $scope.WeeksTotalScore = $scope.MondaysScore + $scope.TuesdaysScore + $scope.WednesdayScore + $scope.ThursdayScore + $scope.FridayScore + $scope.SaturdayScore + $scope.SundayScore;
            });
        });
    };
    $scope.showTeam = function() {
        $scope.players = [];
        $scope.teamBenchPlayers = [];
        angular.forEach($scope.myTeam, function(player_ID) {
            $scope.player = "http://mlb.com/lookup/json/named.player_info.bam?sport_code='mlb'&player_id='" + player_ID + "'";
            $http.get($scope.player).success(function(data, status, headers, config) {
                $scope.players.push(data.player_info.queryResults.row);
            }).error(function(data, status, headers, config) {
                alert(status);
            });
        });
        angular.forEach($scope.benchPlayers, function(player_ID) {
            $scope.player = "http://mlb.com/lookup/json/named.player_info.bam?sport_code='mlb'&player_id='" + player_ID + "'";
            $http.get($scope.player).success(function(data, status, headers, config) {
                $scope.teamBenchPlayers.push(data.player_info.queryResults.row);
            }).error(function(data, status, headers, config) {
                alert(status);
            });
        });
    };
    $scope.grabFourtyMan = function() {
        $scope.fourtyManRosters = null;
        angular.forEach($scope.mlbTeamIDs, function(team_ID) {
            $scope.fourtyManURL = "http://mlb.mlb.com/lookup/json/named.roster_40.bam?team_id='" + team_ID + "'";
            $http.get($scope.fourtyManURL).success(function(data, status, headers, config) {

                if ($scope.fourtyManRosters == null) {
                    $scope.fourtyManRosters = JSON.stringify(data.roster_40.queryResults.row);
                    $scope.fourtyManRosters = $scope.fourtyManRosters.replace('[', '').replace(']', '');
                } else {
                    $scope.fourtyManRosters = $scope.fourtyManRosters + ',' + JSON.stringify(data.roster_40.queryResults.row);
                    $scope.fourtyManRosters = $scope.fourtyManRosters.replace('[', '').replace(']', '');
                }
                $scope.fourtyManRosters = $scope.fourtyManRosters.replace('[', '').replace(']', '');
                $scope.fourtyManRosters = "[" + $scope.fourtyManRosters + "]";
            }).error(function(data, status, headers, config) {
                alert(data);
            });
        });
        $scope.fourtyManRosters = $scope.fourtyManRosters;
        //alert("2");
    };
    $scope.setTheDate = function(pageLoad) {
        //Goes back to previous day if between midnight and 11am
        var hourOfday = new Date().getHours();
        if ((hourOfday >= 0 && hourOfday <= 10) && pageLoad) {
            selectedDate.setDate(selectedDate.getDate() - 1);
        }
        var date1 = new Date(d);
        var date2 = new Date(selectedDate);
        $scope.todaysDate = date1.addDays(0).toString('M/d/yyyy');
        $scope.currentSelectedDate = date2.addDays(0).toString('M/d/yyyy');
        $scope.day = selectedDate.getDate();
        $scope.month = selectedDate.getMonth() + 1;
        $scope.year = selectedDate.getFullYear();
        if ($scope.day < 10) {
            $scope.day = '0' + $scope.day;
        }
        if ($scope.month < 10) {
            $scope.month = '0' + $scope.month;
        }

    };
    $scope.changeDate = function(value, pageLoad) {
        selectedDate.setDate(selectedDate.getDate() + value);
        //parent.document.getElementById
        $('#dateBack').attr('disabled', 'disabled');
        $('#dateForward').attr('disabled', 'disabled');
        $scope.setTheDate(pageLoad);
        $scope.weeklyScores();
        $scope.getWeekRange();
        $scope.findMyTeam($scope.whichTeam);
        $scope.Joel = [];
        $scope.pointsPerPlayerID = [];
        $scope.init();
        //console.log($scope.myPitchingStaff);
        $scope.pitchingPoints();
        $timeout(function() {
            $('#dateBack').removeAttr('disabled');
            if ($scope.todaysDate != $scope.currentSelectedDate) {
                $('#dateForward').removeAttr('disabled');
            };
        }, 2000);
    };
    $scope.getWeekRange = function() {
        Date.prototype.getWeek = function(start) {
            //Calcing the starting point
            start = start || 1; //1 makes it start on Monday and not Sunday
            var today = new Date(this.setHours(0, 0, 0, 0));
            if (today.getDay() != 0) {
                var day = today.getDay() - start;
                var date = today.getDate() - day;
                $scope.StartDate = new Date(today.setDate(date)).toString('M/d/yyyy');
                $scope.EndDate = new Date(today.setDate(date + 6)).toString('M/d/yyyy');
            } else {
                //finds range if it is sunday
                var day = today.getDay();
                var date = today.getDate() - day;
                $scope.StartDate = new Date(today.setDate(date - 6)).toString('M/d/yyyy');
                $scope.EndDate = new Date(today.setDate(date)).toString('M/d/yyyy');
            };
        }
        selectedDate.getWeek();
    };
    $scope.backToTodaysDate = function() {
        selectedDate = Date.today();
        $scope.changeDate(0, false);
    };
    $scope.getInning = function(gameinfo) {
        // var linescore = gameinfo.linescore.inning_line_score;
        // var inning = null;
        // if (linescore.inning == 1) {
        //     inning = linescore.inning;
        //     if (linescore.home == undefined) {
        //         TopOrBottom = "T";
        //     } else {
        //         TopOrBottom = "B";
        //     }
        //     return TopOrBottom + inning;
        // } else {
        //     lastItem = linescore[gameinfo.linescore.inning_line_score.length - 1];
        //     inning = lastItem.inning;
        //     if (lastItem.home == undefined) {
        //         TopOrBottom = "T";
        //     } else {
        //         TopOrBottom = "B";
        //     }
        //     return TopOrBottom + inning;
        // }

    };
    $scope.getStaffPictureAbbreviation = function(teamAbbreviation) {
        switch (teamAbbreviation) {
            case "lan":
                return "la";
            case "tba":
                return "tb";
            case "nyn":
                return "nym";
            case "sln":
                return "stl";
            case "sfn":
                return "sf";
            case "chn":
                return "chc";
            default:
                return teamAbbreviation
        }
    };
    $scope.getTeamAbbreviation = function(teamAbbreviation) {
        switch (teamAbbreviation) {
            case "lan":
                return "LAD";
            case "ana":
                return "LAA";
            case "chn":
                return "CHC";
            case "tba":
                return "TB";
            case "kca":
                return "KC";
            case "cha":
                return "CHW";
            case "nya":
                return "NYY";
            case "sfn":
                return "SF";
            case "nyn":
                return "NYM";
            case "sdn":
                return "SD";
            case "sln":
                return "STL";
            default:
                return teamAbbreviation
        }
    };
    $scope.getTeamLogoAbbreviation = function(teamAbbreviation) {
        switch (teamAbbreviation.toLowerCase()) {
            case "wsh":
                return "was";
            case "lad":
                return "la";
            case "laa":
                return "ana";
            default:
                return teamAbbreviation.toLowerCase()
        }
    };
    $scope.getGamesScore = function(gameinfo) {
        $scope.homeTeamCode = ($scope.getTeamAbbreviation(gameinfo.home_team_code)).toUpperCase();
        $scope.awayTeamCode = ($scope.getTeamAbbreviation(gameinfo.away_team_code)).toUpperCase();
        $scope.homeTeamRuns = gameinfo.linescore.home_team_runs;
        $scope.awayTeamRuns = gameinfo.linescore.away_team_runs;
        return $scope.awayTeamCode + ' ' + $scope.awayTeamRuns + ' ' + $scope.homeTeamCode + ' ' + $scope.homeTeamRuns;
    };

    $scope.setTeam = function(team) {
        $scope.selectedTeam = team;
    };

    $scope.hittingPoints = function() {
        $scope.totalBattingPoints = 0;
        angular.forEach($scope.baseballGame, function(eachFullGameJSON) {
            angular.forEach(eachFullGameJSON, function(eachGame) {
                var hittingBoxscore = eachGame.data.data.boxscore.batting;
                angular.forEach(hittingBoxscore, function(eachTeamsBoxscore) {
                    var eachLineUp = eachTeamsBoxscore.batter;
                    angular.forEach(eachLineUp, function(eachBatter) {
                        if ($scope.selectedTeam.indexOf(eachBatter.id.toString()) > -1) {
                            $scope.totalBattingPoints += parseFloat($scope.getScore(0, eachBatter));
                        };
                    });
                });
            });
        });
        return $scope.totalBattingPoints;
    };
    $scope.pitchingPoints = function() {
        $scope.pitchingStaffGamesTotals = [];
        $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_1.xml';
        $scope.pitchingStaffGamesTotals.push($scope.game1);
        //alert($scope.doubleHeader);
        if ($scope.doubleHeader) {
            $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
            $scope.pitchingStaffGamesTotals.push($scope.game2);
            //alert("Got here");
        };

        angular.forEach($scope.pitchingStaffGamesTotals, function(pitchingTotals) {
            $scope.pitchingGame = $http.get(pitchingTotals);
            $q.all([$scope.pitchingGame]).then(function(dataTotals) {

                var x2js = new X2JS();
                convertedData = x2js.xml_str2json(dataTotals[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                var gameTotal = $scope.getPitchingStaffScore(convertedData.pitching);
                $scope.total += gameTotal;

            });
        });
    };
    $scope.gatherIds = function(id) {
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
    $scope.getTotal = function() {
        angular.forEach($scope.idsToLookFor, function(id) {
            var score = parseInt($("#" + id).text());

            function lookup(name) {
                for (var i = 0, len = $scope.pointsPerPlayerID.length; i < len; i++) {
                    if ($scope.pointsPerPlayerID[i].key === name) return true;
                }
                return false;
            }
            if (!(isNaN(score))) {
                dateForward
                if (!lookup(id)) {
                    $scope.pointsPerPlayerID.push({
                        key: id,
                        value: score
                    });
                    //$scope.total += score;
                }
            }
        });
        return $scope.total;
    };
    $scope.getScore = function(index, x) {

        var angi = parseInt(index);
        var score = ((((parseFloat(x.h)) - (parseFloat(x.d) + parseFloat(x.t) + parseFloat(x.hr))) * 1) + (parseFloat(x.d) * 2) + (parseFloat(x.t) * 3) + (parseFloat(x.hr) * 4) + (parseFloat(x.r) * 1) + (parseFloat(x.rbi) * 1) + (parseFloat(x.bb) * 1) + (parseFloat(x.sb) * 2) + (parseFloat(x.cs) * -1));
        return score;
    };
    $scope.players = function() {
        $http.get('../Baseball/json/fourtyMan.json').success(function(data) {
            $scope.playerJSON = data;

            $(document).ready(function() {
                $timeout(function() {
                    $('#myTable2').DataTable({
                        "bScrollCollapse": true,
                        "bPaginate": true,
                        "bJQueryUI": false,
                        "sPaginationType": "full_numbers",
                        "order": [
                            [3, "asc"]
                        ]
                    });
                }, 0);
            });
        });
    };
    $scope.getPitchingStaffScore = function(x) {
        var pointsForHitsAndWalks = 0;
        var pointsForStrikeOuts = 0;
        var pointsForEarnedRuns = 0;
        var pointsForWin = 0;

        if (x._w == 1) {
            pointsForWin = 3;
        }

        if (x._k < 6) {
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
        return pitchingScore;
    };
    $scope.numberInTheOrder = function(orderNumber) {
        if (orderNumber.charAt(1) === "0" && orderNumber.charAt(2) === "0") return orderNumber.charAt(0) + ".";
        else return "-";
    };
    $scope.stillInGame = function(team, player) {
        $scope.enteredButLeft = false;
        $scope.entered = false;
        $scope.leftGame = false;
        for (var i = team.batter.length - 1; i >= 0; i--) {
            if ($scope.selectedTeam.indexOf(team.batter[i].id) > -1) {
                for (var b = team.batter.length - 1; b >= 0; b--) {
                    var iBatter = team.batter[i].bo;
                    var bBatter = team.batter[b].bo;
                    if (iBatter != undefined && bBatter != undefined) {
                        if ((iBatter.charAt(0) == bBatter.charAt(0)) && (team.batter[i].id != team.batter[b].id)) {
                            if (parseInt(iBatter.charAt(2)) > 0 && parseInt(bBatter.charAt(2)) > parseInt(iBatter.charAt(2))) {
                                $scope.enteredButLeft = true;
                            } else if (parseInt(iBatter.charAt(2)) > 0) {
                                $scope.entered = true;
                            } else if (parseInt(iBatter.charAt(2)) == 0) {
                                $scope.leftGame = true;
                            }
                        };
                    };
                };
            };
        };
    };
    $scope.getBaseRunners = function(gameID, baseParameter) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                if ($scope.eachGameRefresh[i].runners_on_base.hasOwnProperty(baseParameter)) {
                    return true;
                };
            };
        };
    };
    $scope.isRunnerCurrentPlayer = function(gameID, playerID, baseParameter) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                if ($scope.eachGameRefresh[i].runners_on_base.hasOwnProperty(baseParameter)) {
                    if (baseParameter == 'runner_on_1b') {
                        if ($scope.eachGameRefresh[i].runners_on_base.runner_on_1b.id == playerID) {
                            return true;
                        };
                    };
                    if (baseParameter == 'runner_on_2b') {
                        if ($scope.eachGameRefresh[i].runners_on_base.runner_on_2b.id == playerID) {
                            return true;
                        };
                    };
                    if (baseParameter == 'runner_on_3b') {
                        if ($scope.eachGameRefresh[i].runners_on_base.runner_on_3b.id == playerID) {
                            return true;
                        };
                    };
                };
            };
        };
    };
    $scope.getGameStatus = function(gameID) {
        $scope.gameStatus = null;
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                $scope.gameStatus = $scope.eachGameRefresh[i].status.ind;
                break;
            };
        };
    };
    $scope.getMoreGameInfo = function(gameID, needInnings) {
        // for (var i = $scope.eachGame.length - 1; i >= 0; i--) {
        //console.log(gameID);
        //if (gameID == $scope.eachGameRefresh[i].game_pk) {
        //console.log(JSON.stringify($scope.eachGame[i]));
        //$scope.timeOfGame = null
        //$scope.matchUp = null;
        //scope.pitchingStaffGameStatus = $scope.eachGameRefresh[i].status.ind;
        // if (needInnings) {
        //     $scope.pitchingStaffGameStatus = null;
        //     $scope.pitchingGameScore = null;
        //     //$scope.pitchingStaffGameStatus = $scope.eachGame[i].status.ind;
        //     $scope.pitchingGameScore = $scope.eachGame[i].away_name_abbrev + " " + $scope.eachGame[i].linescore.r.away + " " + $scope.eachGame[i].home_name_abbrev + " " + $scope.eachGame[i].linescore.r.home;
        // };
        // if ($scope.eachGame[i].status.status == 'Pre-Game') {
        //     $scope.matchUp = $scope.eachGame[i].away_name_abbrev + " @ " + $scope.eachGame[i].home_name_abbrev;
        //     $scope.timeOfGame = $scope.eachGame[i].time + $scope.eachGame[i].ampm;
        // };
        // if ($scope.eachGame[i].status.status == 'In Progress' && needInnings) {
        //     $scope.pitchingStaffInning = $scope.eachGame[i].status.inning;
        //     if ($scope.eachGame[i].status.inning_state = "Bottom") {
        //         $scope.pitchingStaffTopOrBottom = "B";
        //     } else {
        //         $scope.pitchingStaffTopOrBottom = "T";
        //     }
        //     $scope.pitchingGameInning = $scope.pitchingStaffTopOrBottom + $scope.pitchingStaffInning;
        // };
        //break;
        //};
        //};
    };
    $scope.getCurrentGamesScore = function(gameID) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                $scope.pitchingStaffGameStatus = $scope.eachGameRefresh[i].status.ind;
                if ($scope.pitchingStaffGameStatus != 'DR') {
                    return $scope.eachGameRefresh[i].away_name_abbrev + ' ' + $scope.eachGameRefresh[i].linescore.r.away + ' ' + $scope.eachGameRefresh[i].home_name_abbrev + ' ' + $scope.eachGameRefresh[i].linescore.r.home;
                };
            };
        };
    };

    $scope.getCurrentCount = function(gameID, indicator) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                var inningState = $scope.eachGameRefresh[i].status.inning_state.toLowerCase();
                if (inningState == 'top' || inningState == 'bottom') {
                    switch (indicator) {
                        case "Ball":
                            return $scope.eachGameRefresh[i].status.b;
                        case "Strike":
                            return $scope.eachGameRefresh[i].status.s;
                        case "Out":
                            return $scope.eachGameRefresh[i].status.o;
                        default:
                            console.log('error')
                    }
                }
            };
        };
    };

    $scope.getMatchup = function(gameID) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                if ($scope.eachGameRefresh[i].status.status == 'Pre-Game') {
                    return $scope.eachGameRefresh[i].away_name_abbrev + ' @ ' + $scope.eachGameRefresh[i].home_name_abbrev + ' ' + $scope.eachGameRefresh[i].time + ' ' + $scope.eachGameRefresh[i].ampm;
                };
            };
        };
    };

    $scope.getCurrentGamesInning = function(gameID) {
        for (var i = $scope.eachGameRefresh.length - 1; i >= 0; i--) {
            if (gameID == $scope.eachGameRefresh[i].game_pk) {
                if ($scope.eachGameRefresh[i].status.status == 'In Progress') {
                    $scope.pitchingStaffInning = $scope.eachGameRefresh[i].status.inning;
                    switch ($scope.eachGameRefresh[i].status.inning_state.toLowerCase()) {
                        case 'top':
                            $scope.pitchingStaffTopOrBottom = 'T';
                            break;
                        case 'middle':
                            $scope.pitchingStaffTopOrBottom = 'M';
                            break;
                        case 'end':
                            $scope.pitchingStaffTopOrBottom = 'E';
                            break;
                        default:
                            $scope.pitchingStaffTopOrBottom = 'B';
                    }
                    return ", " + $scope.pitchingStaffTopOrBottom + $scope.pitchingStaffInning;
                };
            };
        };
    };

    $scope.init = function() {
        //$scope.changeDate(0);
        $scope.total = 0;
        $scope.idsToLookFor = [];
        $scope.pointsPerPlayerID = [];
        baseball = [];
        $scope.baseballGame = null;
        $scope.daysGames = [];
        $scope.playersUpToBat = [];
        $scope.playersOnDeck = [];
        $scope.playersInTheHole = [];
        $scope.allPitchingStaffGames = [];
        $scope.pitchingStaffGames = [];
        $scope.pitchingGame = [];
        //$scope.doubleHeader = false;
        $scope.pitchingStaffStatus = null;

        //alert($scope.month + "/" + $scope.day + "/" + $scope.year);
        $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/master_scoreboard.json';
        //alert($scope.scoreBoard);


        $http.get($scope.scoreBoard).success(function(data) {
            $scope.eachGame = data.data.games.game;
            $scope.eachGameRefresh = data.data.games.game;
            angular.forEach($scope.eachGame, function(batter) {
                $scope.pitchingStaffGameID = batter.game_pk;
                if (batter.away_code == $scope.myPitchingStaff || batter.home_code == $scope.myPitchingStaff) {
                    if (batter.double_header_sw != 'N') {
                        $scope.doubleHeader = true;
                        //alert("doubleHeader");
                    };
                    $scope.pitchingStaffStatus = batter.status;
                    if (batter.away_code == $scope.myPitchingStaff) {
                        $scope.pitchingStaffTeamName = batter.away_team_city + ' ' + batter.away_team_name;
                    } else {
                        $scope.pitchingStaffTeamName = batter.home_team_city + ' ' + batter.home_team_name;
                    }
                };

                if (batter.hasOwnProperty('inhole')) {
                    $scope.playersUpToBat.push(batter.batter.id);
                    $scope.playersOnDeck.push(batter.ondeck.id);
                    $scope.playersInTheHole.push(batter.inhole.id);
                }
                var JSONlink = batter.game_data_directory;

                $scope.daysGames.push('http://gd2.mlb.com' + JSONlink + "/boxscore.json");
            });

            //alert($scope.daysGames);
            angular.forEach($scope.daysGames, function(games) {
                $scope.game = $http.get(games);
                $q.all([$scope.game]).then(function(values) {
                    baseball.push(values);
                    $scope.baseballGame = baseball;
                    //$scope.reds = baseball[0][0].data.data.boxscore.batting;
                    //Trying to get each hitter instead of every player in the boxscore
                    // angular.forEach($scope.baseballGame, function(eachFullGameJSON) {
                    //     // console.log("Joel");
                    //     angular.forEach(eachFullGameJSON, function(eachGame) {
                    //         // console.log("Joel2");
                    //         var hittingBoxscore = eachGame.data.data.boxscore.batting;
                    //         angular.forEach(hittingBoxscore, function(eachTeamsBoxscore) {
                    //             // console.log("Joel3");
                    //             var eachLineUp = eachTeamsBoxscore.batter;
                    //             angular.forEach(eachLineUp, function(eachBatter) {
                    //                 // console.log("Joel4");
                    //                 if ($scope.selectedTeam.indexOf(eachBatter.id.toString()) > -1) {
                    //                     if ($scope.hitters.indexOf(eachBatter) == -1) {
                    //                         $scope.hitters.push(eachBatter);
                    //                         console.log($scope.hitters);
                    //                     };
                    //                 };
                    //             });
                    //         });
                    //     });
                    // });

                    //END
                });
            });
            // $scope.injuryNews();

            $scope.pitchingStaff();
        });
        $scope.hitters = [];
        $scope.getTotal();

    };
    $scope.injuryNews = function() {
        // $scope.injuryData = [];
        // $.getJSON('http://anyorigin.com/dev/get?url=http%3A//www.mlb.com/fantasylookup/json/named.wsfb_news_injury.bam&callback=?', function(data) {
        //     //alert(JSON.stringify(data.contents));
        //     $scope.injuryDataObj = data.contents.wsfb_news_injury.queryResults.row;
        //     angular.forEach($scope.injuryDataObj, function(injuredPlayer) {
        //         $scope.injuryData.push(injuredPlayer.player_id);
        //     });
        //     console.log($scope.injuryData);
        // });
    };
    $scope.injuryNewsChecker = function(playerID) {
        // var injured = false;
        // //console.log(playerID);
        // if ($scope.myTeam.indexOf(playerID.toString()) > -1 || $scope.benchPlayers.indexOf(playerID.toString()) > -1) {
        //     console.log(playerID);
        //     if ($scope.mlbPlayers.indexOf(playerID.toString()) > -1) {
        //         injured = true;
        //     } else {
        //         injured = false;
        //     }

        // }
    };
    $scope.pitchingStaff = function() {
        $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_1.xml';
        $scope.pitchingStaffGames.push($scope.game1);
        if ($scope.doubleHeader) {
            $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
            $scope.pitchingStaffGames.push($scope.game2);
        };
        angular.forEach($scope.pitchingStaffGames, function(pitching) {
            $scope.pitchingGame = $http.get(pitching);
            $q.all([$scope.pitchingGame]).then(function(data) {

                var x2js = new X2JS();
                //alert("here1");
                convertedData = x2js.xml_str2json(data[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                //alert("here2");
                $scope.pitchingStaffStats = convertedData.pitching;
                //alert("here3");
                $scope.allPitchingStaffGames.push($scope.pitchingStaffStats);
                $('#pitchingTable').show();

            });
        });
    };
    $scope.lineupJSON = [];
    $scope.mlbPlayers = [];
    $scope.allInjuryInfo = [];
    $scope.InjuryNotes = function(playerID) {
        alert($scope.allInjuryInfo[$scope.mlbPlayers.indexOf(playerID)].injury_update)
    };
    $scope.teamer2 = function(mlb) {
        $scope.lineupJSON = mlb.wsfb_news_injury.queryResults.row;
        angular.forEach($scope.lineupJSON, function(player) {
            $scope.mlbPlayers.push(player.player_id);
            $scope.allInjuryInfo.push(player);
        });
    };
    $scope.teamer = function() {
        $scope.lineup = null;
        $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.wsfb_news_injury.bam',
            data: {
                format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                $scope.mlbPlayers = [];
                $scope.lineup = data;
                $scope.$apply();
                $scope.teamer2($scope.lineup);
            },
            type: 'GET'
        });

    };
    $scope.standings = function() {
        $scope.standingsData = null;
        $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_index_standings.bam?league_id=8623',
            data: {
                //format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                $scope.dater = data;
                $scope.$apply();
            },
            type: 'GET'
        });
    };
    $scope.mlbTeam = function() {
        $scope.periodId = $("#period_id").val();
        $scope.teamID = $("#team_id").val();
        $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID,
            data: {
                //format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                $scope.mlbTeam = data;
                $scope.setBench = [];
                $scope.setDL = [];
                $scope.setPitchingStaff = [];
                $scope.setLineUp = [];
                angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                    if (player.slot_val == 'Bn') {
                        $scope.setBench.push(player.player_id);
                    } else if (player.slot_val == 'DL') {
                        $scope.setDL.push(player.player_id);
                    } else if (player.slot_val == 'PS') {
                        $scope.setPitchingStaff.push(player.player_id);
                    } else {
                        $scope.setLineUp.push(player.player_id);
                    }
                });
                $scope.$apply();
            },
            type: 'GET'
        });
    };
    $scope.getScheduleChecker = function(schedule, player, day) {
        //console.log((schedule.game_date + '/2015').toString('dddd') == 'Monday');
        if (schedule.league_player_id == player.league_player_id && (schedule.game_date + '/2015').toString('dddd') == day) {

        };
    };
    $scope.getTeamsSchedule = function() {
        $scope.periodId = $("#period_id").val();
        $scope.teamID = $("#team_id").val();
        //console.log('http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_schedule.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID);
        $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_schedule.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID,
            data: {
                //format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                $scope.schedule = data;
                $scope.mlbTeam = null;
                angular.forEach($scope.schedule.fb_team_lineup_view_schedule.queryResults.row, function(eachgame) {
                    $scope.playerID = null;
                    $.ajax({
                        url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID,
                        data: {
                            //format: 'json'
                        },
                        error: function() {
                            console.log("Error");
                        },
                        dataType: 'json',
                        success: function(data) {
                            $scope.mlbTeam = data;

                            for (var i = $scope.mlbTeam.fb_team_lineup.queryResults.row.length - 1; i >= 0; i--) {
                                if ($scope.mlbTeam.fb_team_lineup.queryResults.row[i].league_player_id == eachgame.league_player_id) {
                                    $scope.playerID = $scope.mlbTeam.fb_team_lineup.queryResults.row[i].player_id;
                                    break;
                                };
                            };

                            $.ajax({
                                url: 'http://m.mlb.com/lookup/json/named.stats_batter_vs_pitcher_composed.bam?league_list_id=%27mlb%27&game_type=%27R%27&player_id=' + $scope.playerID + '&pitcher_id=' + eachgame.opp_probable_pitcher_id,
                                data: {
                                    //format: 'json'
                                },
                                error: function() {
                                    console.log("Error");
                                },
                                dataType: 'json',
                                success: function(data) {
                                    console.log("HERE");
                                    console.log(data);
                                    eachgame.pitcherVsBatter = data.stats_batter_vs_pitcher_composed.stats_batter_vs_pitcher_total.queryResults.row;

                                },
                                type: 'GET'
                            });
                        },
                        type: 'GET'
                    });
                    // };
                    //$scope.$apply();
                    //console.log($scope.getPitcherVsBatter(eachgame.opp_probable_pitcher_id, eachgame.league_player_id));
                });
                //$scope.$apply();
                //console.log(JSON.stringify($scope.schedule.fb_team_lineup_view_schedule.queryResults));

            },
            type: 'GET'
        });
    };
    $scope.getPitcherVsBatter = function(pitcherID, batterID) {
        //$scope.periodId = $("#period_id").val();
        //$scope.teamID = $("#team_id").val();
        //console.log('http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_schedule.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID);
        $scope.pitcherVsBatterData = null;
        //console.log('http://m.mlb.com/lookup/json/named.stats_batter_vs_pitcher_composed.bam?league_list_id=%27mlb%27&game_type=%27R%27&player_id=' + batterID + '&pitcher_id=' + pitcherID);
        $.ajax({
            url: 'http://m.mlb.com/lookup/json/named.stats_batter_vs_pitcher_composed.bam?league_list_id=%27mlb%27&game_type=%27R%27&player_id=' + batterID + '&pitcher_id=' + pitcherID,
            data: {
                //format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                console.log("HERE");
                console.log(data);

                $scope.pitcherVsBatterData = data;
                $scope.$apply();
            },
            type: 'GET'
        });
        return $scope.pitcherVsBatterData;
    };
    $scope.getTeams = function() {

        $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_global_teams.bam?league_id=8623',
            data: {
                //format: 'json'
            },
            error: function() {
                console.log("Error");
            },
            dataType: 'json',
            success: function(data) {
                $scope.fantasyTeams = data.fb_global_teams.queryResults;
                $scope.$apply();
            },
            type: 'GET'
        });
    };
});
