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

 var myApp = angular.module('myApp', []);
 myApp.controller('baseballController', function($scope, $http, $q, $timeout) {
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
     $scope.opponentsTeam = ['519390', '543333', '456030', '607054', '408314', '460576', '430945', '493114', '451594'];
     $scope.selectedTeam = [];
     $scope.idsToLookFor = [];
     $scope.myPichingStaff = '';
     $scope.selectedStaff = null;
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
     $scope.lastMonday = mondayDateHelper.previous().monday().toString('M/d/yyyy');
     $scope.lastSunday = mondayDateHelper.previous().sunday().toString('M/d/yyyy');
     $scope.nextMonday = mondayDateHelper.next().monday().toString('M/d/yyyy');
     $scope.nextSunday = mondayDateHelper.next().sunday().toString('M/d/yyyy');
     $scope.mlbTeamIDs = [145, 143, 113, 144, 147, 120, 141, 114, 119, 115, 118, 142, 109, 133, 136, 134, 110, 116, 111, 146, 121, 139, 112, 140, 117, 158, 138, 108, 135, 137];
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
     $scope.Teams = [];


     $scope.findMyTeam = function() {
         var d1 = parseDate('2015-06-15');
         var d2 = parseDate(selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate());
         if (d2.toString('M/d/yyyy') >= d1.toString('M/d/yyyy')) {
             //Should show CARGO NOT IAN DESMOND on my team for any date after 6/15
             //alert("CARGO");
             $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '471865', '592626', '592518', '457763'];
         } else {
             //alert("IAN");
             $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '435622', '592626', '592518', '457763'];
         }
         $scope.Teams = [{
             staff: 'lan',
             players: $scope.myTeam
         }, {
             staff: 'min',
             players: $scope.opponentsTeam
         }];

     };
     $scope.setTeam = function(team, staff) {
         $scope.selectedTeam = team;
         $scope.selectedStaff = staff;
     };
     $scope.pitch = function() {
         $scope.allPitchingStaffGames = [];
         angular.forEach($scope.Teams, function(team) {
             console.log("Here =" + team.staff);
             // console.log("staff =" + staff);
             // console.log($scope.selectedStaff == staff);
             //$scope.allPitchingStaffGames = [];
             //$scope.pitchingStaffGames = [];
             //console.log("sel2 =" + $scope.selectedStaff);
             $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + team.staff + '_1.xml';
             $scope.pitchingStaffGames.push({
                 staff: team.staff,
                 game_url: $scope.game1
             });
             //if ($scope.doubleHeader) {
             // $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.selectedStaff + '_2.xml';
             // $scope.pitchingStaffGames.push($scope.game2);

             //};

         });
         angular.forEach($scope.pitchingStaffGames, function(pitching) {
             console.log("Here pitching =" + pitching);
             //console.log("sel3 =" + $scope.selectedStaff);
             $scope.pitchingGame = $http.get(pitching.game_url);
             $q.all([$scope.pitchingGame]).then(function(data) {
                 console.log(data);
                 var x2js = new X2JS();
                 //alert("here1");
                 convertedData = x2js.xml_str2json(data[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                 //alert("here2");
                 $scope.pitchingStaffStats = convertedData.pitching;
                 $scope.allPitchingStaffGames.push({
                     staff: pitching.staff,
                     data: $scope.pitchingStaffStats
                 });
             });
         });
     };
     $scope.showTeam = function() {
         $scope.players = [];
         angular.forEach($scope.myTeam, function(player_ID) {
             $scope.player = "http://mlb.com/lookup/json/named.player_info.bam?sport_code='mlb'&player_id='" + player_ID + "'";
             $http.get($scope.player).success(function(data, status, headers, config) {

                 $scope.players.push(data.player_info.queryResults.row);
             }).error(function(data, status, headers, config) {
                 alert(status);
             });
         });
     };
     $scope.grabFourtyMan = function() {
         $scope.fourtyManRosters = [];
         angular.forEach($scope.mlbTeamIDs, function(team_ID) {
             $scope.fourtyManURL = "http://mlb.mlb.com/lookup/json/named.roster_40.bam?team_id='" + team_ID + "'";
             $http.get($scope.fourtyManURL).success(function(data, status, headers, config) {
                 $scope.fourtyManRosters.push(data.roster_40.queryResults.row);
             }).error(function(data, status, headers, config) {
                 alert(data);
             });
         });
     };
     $scope.changeDate = function(value, pageLoad) {

         selectedDate.setDate(selectedDate.getDate() + value);
         $('#dateBack').attr('disabled', 'disabled');
         $('#dateForward').attr('disabled', 'disabled');

         //Goes back to previous day if between midnight and 10am
         var hourOfday = new Date().getHours();
         if ((hourOfday >= 0 && hourOfday <= 20) && pageLoad) {
             console.log("Ran!!");
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

         //finds out when Monday is for each week ***only works going backwards***

         if ($scope.lastSunday == selectedDate.toString('M/d/yyyy') || $scope.nextSunday == selectedDate.toString('M/d/yyyy')) {
             mondayDateHelper = new Date(selectedDate);
             $scope.lastMonday = mondayDateHelper.previous().monday().toString('M/d/yyyy');
             $scope.lastSunday = mondayDateHelper.previous().sunday().toString('M/d/yyyy');
             $scope.nextMonday = mondayDateHelper.next().monday().toString('M/d/yyyy');
             $scope.nextSunday = mondayDateHelper.next().sunday().toString('M/d/yyyy');
         }
         // $scope.findMyTeam();
         // $scope.Joel = [];
         // $scope.pointsPerPlayerID = [];

         $scope.init2();

         // $scope.pitchingPoints();
         // $timeout(function() {
         //     $('#dateBack').removeAttr('disabled');
         //     if ($scope.todaysDate != $scope.currentSelectedDate) {
         //         $('#dateForward').removeAttr('disabled');
         //     };
         // }, 1000);

     };

     $scope.backToTodaysDate = function() {
         selectedDate = Date.today();
         $scope.changeDate(0, false);
     };
     $scope.getInning = function(gameinfo) {
         var linescore = gameinfo.linescore.inning_line_score;
         var inning = null;
         if (linescore.inning == 1) {
             inning = linescore.inning;
             if (linescore.home == undefined) {
                 TopOrBottom = "T";
             } else {
                 TopOrBottom = "B";
             }
             return TopOrBottom + inning;
         } else {
             lastItem = linescore[gameinfo.linescore.inning_line_score.length - 1];
             inning = lastItem.inning;
             if (lastItem.home == undefined) {
                 TopOrBottom = "T";
             } else {
                 TopOrBottom = "B";
             }
             return TopOrBottom + inning;
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
     $scope.getGamesScore = function(gameinfo) {
         $scope.homeTeamCode = ($scope.getTeamAbbreviation(gameinfo.home_team_code)).toUpperCase();
         $scope.awayTeamCode = ($scope.getTeamAbbreviation(gameinfo.away_team_code)).toUpperCase();
         $scope.homeTeamRuns = gameinfo.linescore.home_team_runs;
         $scope.awayTeamRuns = gameinfo.linescore.away_team_runs;
         return $scope.awayTeamCode + ' ' + $scope.awayTeamRuns + ' ' + $scope.homeTeamCode + ' ' + $scope.homeTeamRuns;
     };
     $scope.getTotalScore = function(pitchingTotal, hittingTotal) {
         $scope.total = parseFloat($scope.total) + parseFloat(hittingTotal);
         return $scope.total;
     };
     $scope.hittingPoints = function() {
         $scope.totalBattingPoints = 0;
         angular.forEach($scope.baseballGame, function(Joel) {
             angular.forEach(Joel, function(eachGame) {
                 var tryThis = eachGame.data.data.boxscore.batting;
                 angular.forEach(tryThis, function(eachLineUp) {
                     var tryThis2 = eachLineUp.batter;
                     angular.forEach(tryThis2, function(batter) {
                         if ($scope.selectedTeam.indexOf(batter.id.toString()) > -1) {
                             $scope.totalBattingPoints += parseFloat($scope.getScore(0, batter));
                         };
                     });
                 });
             });
         });
         return $scope.totalBattingPoints;
     };
     $scope.pitchingPoints = function() {
         $scope.pitchingStaffGamesTotals = [];
         $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.selectedStaff + '_1.xml';
         $scope.pitchingStaffGamesTotals.push($scope.game1);
         //alert($scope.doubleHeader);
         if ($scope.doubleHeader) {
             $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.selectedStaff + '_2.xml';
             $scope.pitchingStaffGamesTotals.push($scope.game2);
             //alert("Got here");
         };

         angular.forEach($scope.pitchingStaffGamesTotals, function(pitchingTotals) {
             $scope.pitchingGame = $http.get(pitchingTotals);
             $q.all([$scope.pitchingGame]).then(function(dataTotals) {

                 var x2js = new X2JS();
                 convertedData = x2js.xml_str2json(dataTotals[0].data.replace(/<!--[\s\S]*?-->/g, ""));
                 var gameTotal = $scope.getPitchingStaffScore(convertedData.pitching);
                 $scope.total = gameTotal;

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
             if ($scope.myTeam.indexOf(team.batter[i].id) > -1) {
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
     $scope.getMoreGameInfo = function(gameID, needInnings) {
         for (var i = $scope.eachGame.length - 1; i >= 0; i--) {
             if (gameID == $scope.eachGame[i].game_pk) {
                 $scope.timeOfGame = null
                 $scope.matchUp = null;
                 if (needInnings) {
                     $scope.pitchingStaffGameStatus = null;
                     $scope.pitchingGameScore = null;
                     $scope.pitchingStaffGameStatus = $scope.eachGame[i].status.ind;
                     $scope.pitchingGameScore = $scope.eachGame[i].away_name_abbrev + " " + $scope.eachGame[i].linescore.r.away + " " + $scope.eachGame[i].home_name_abbrev + " " + $scope.eachGame[i].linescore.r.home;
                 };
                 if ($scope.eachGame[i].status.status == 'Pre-Game') {
                     $scope.matchUp = $scope.eachGame[i].away_name_abbrev + " @ " + $scope.eachGame[i].home_name_abbrev;
                     $scope.timeOfGame = $scope.eachGame[i].time + $scope.eachGame[i].ampm;
                 };
                 if ($scope.eachGame[i].status.status == 'In Progress' && needInnings) {
                     $scope.pitchingStaffInning = $scope.eachGame[i].status.inning;
                     if ($scope.eachGame[i].status.inning_state = "Bottom") {
                         $scope.pitchingStaffTopOrBottom = "B";
                     } else {
                         $scope.pitchingStaffTopOrBottom = "T";
                     }
                     $scope.pitchingGameInning = $scope.pitchingStaffTopOrBottom + $scope.pitchingStaffInning;
                 };
                 break;
             };
         };
     };
     $scope.init2 = function() {
         $scope.findMyTeam();
         $scope.pitch();
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
             angular.forEach($scope.eachGame, function(batter) {
                 var thisSession = batter;
                 if (batter.away_code == $scope.selectedStaff || batter.home_code == $scope.selectedStaff) {
                     if (batter.double_header_sw != 'N') {
                         $scope.doubleHeader = true;
                         //alert("doubleHeader");
                     };
                     $scope.pitchingStaffGameID = batter.game_pk;
                     $scope.pitchingStaffStatus = batter.status;
                     if (batter.away_code == $scope.selectedStaff) {
                         $scope.pitchingStaffTeamName = batter.away_team_city + ' ' + batter.away_team_name;
                     } else {
                         $scope.pitchingStaffTeamName = batter.home_team_city + ' ' + batter.home_team_name;
                     }
                 };

                 if (thisSession.hasOwnProperty('inhole')) {
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
                 });
             });
             //$scope.pitch();
         });

         //$scope.getTotal();
     };
     $scope.pitchingStaff = function() {
         angular.forEach($scope.Teams.staff, function(staff) {
             console.log(staff);
             $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + staff + '_1.xml';
             $scope.pitchingStaffGames.push($scope.game1);
             if ($scope.doubleHeader) {
                 $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + staff + '_2.xml';
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
         });
     };
 });
