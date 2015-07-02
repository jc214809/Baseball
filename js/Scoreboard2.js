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
     $scope.findMyTeam = function(tryJoel) {
         $scope.whichTeam = tryJoel;
         var theSelectedDate = parseDate(selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate());
         if (tryJoel == "Mine") {
             if (theSelectedDate.between(parseDate('2015-06-29'), parseDate('2015-07-05'))) {
                 //alert("IAN && CARGO");
                 $scope.myTeam = ['630111', '543829', '471865', '435622', '547989', '425877', '592626', '592518', '457763'];
                 $scope.myPitchingStaff = 'lan';
             } else if (theSelectedDate.between(parseDate('2015-06-22'), parseDate('2015-06-28'))) {
                 //alert("YADI");
                 $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '425877', '592626', '592518', '457763'];
                 $scope.myPitchingStaff = 'lan';
             } else if (theSelectedDate.between(parseDate('2015-06-15'), parseDate('2015-06-21'))) {
                 //alert("CARGO");
                 $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '471865', '592626', '592518', '457763'];
                 $scope.myPitchingStaff = 'lan';
             } else if (theSelectedDate.between(parseDate('2015-06-08'), parseDate('2015-06-14'))) {
                 //alert("IAN");
                 $scope.myTeam = ['630111', '543829', '434670', '425783', '547989', '435622', '592626', '592518', '457763'];
                 $scope.myPitchingStaff = 'lan';
             } else {
                 //alert("DEFUALT");
                 $scope.myTeam = [];
                 $scope.myPitchingStaff = '';
             }
             $scope.selectedTeam = $scope.myTeam;
         } else {
             if (theSelectedDate.between(parseDate('2015-06-29'), parseDate('2015-07-05'))) {
                 //alert("WEEK13");
                 $scope.myTeam = ['519083', '408236', '514888', '572761', '453064', '516782', '493316', '571740', '435522'];
                 $scope.myPitchingStaff = 'sfn';
             } else if (theSelectedDate.between(parseDate('2015-06-22'), parseDate('2015-06-28'))) {
                 //alert("WEEK12");
                 $scope.myTeam = ['431145', '425902', '518934', '518626', '516770', '457708', '624577', '136860', '453943'];
                 $scope.myPitchingStaff = 'sln';
             } else if (theSelectedDate.between(parseDate('2015-06-15'), parseDate('2015-06-21'))) {
                 //alert("Week11");
                 $scope.myTeam = ['519390', '543333', '456030', '607054', '408314', '460576', '430945', '493114', '451594'];
                 $scope.myPitchingStaff = 'nyn';
             } else if (theSelectedDate.between(parseDate('2015-06-8'), parseDate('2015-06-14'))) {
                 //alert("WEEK10");
                 $scope.myTeam = ['446308', '502671', '543685', '592178', '425509', '518792', '461314', '519317', '572122'];
                 $scope.myPitchingStaff = 'sea';
             } else {
                 //alert("IAN");
                 $scope.myTeam = [];
                 $scope.myPitchingStaff = '';
             }
             $scope.selectedTeam = $scope.myTeam;
         }
     };
     $scope.findMyStaff = function(staff) {
         //console.log($scope.myPitchingStaff);
         // if (staff == 'LAN') {
         //     $scope.myPitchingStaff = 'lan';
         // } else {
         //     $scope.myPitchingStaff = 'sln';
         // }
     };
     $scope.weeklyScores = function() {
         var dateToFindScores = new Date(selectedDate);
         $scope.getWeekRange();
         while (dateToFindScores.toLocaleDateString() >= $scope.StartDate) {
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
         $scope.baseballGame3 = null;
         $scope.datesArray = [];
         $scope.daysTotalForWeekly = 0;
         // while (dateToFindScores.toLocaleDateString() >= $scope.StartDate) {
         //     $scope.datesArray.push(dateToFindScores.toLocaleDateString());
         //     //console.log(dateToFindScores.toString("dddd"));
         //     dateToFindScores.setDate(dateToFindScores.getDate() - 1);
         // }

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
     $scope.getPoints = function(master, dateOfDay) {
         //console.log(dateOfDay.toString("dddd"));
         $http.get(master).success(function(data) {
             $scope.eachGame3 = null;
             var baseball3 = [];
             $scope.daysGames3 = [];
             $scope.baseballGame3 = null;
             $scope.eachGame3 = data.data.games.game;
             angular.forEach($scope.eachGame3, function(gameInfo) {
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
                                     console.log(eachBatter.id.toString() + '===' + parseFloat($scope.getScore(0, eachBatter)) + '===' + $scope.daysTotalForWeekly);
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
                                         console.log(eachBatter.id.toString() + '===' + parseFloat($scope.getScore(0, eachBatter)));
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
         $scope.pitchingStaffGamesTotals = [];
         $scope.game1 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/pitching_staff/' + $scope.myPitchingStaff + '_1.xml';
         $scope.pitchingStaffGamesTotals.push($scope.game1);
         //alert($scope.doubleHeader);
         //if ($scope.doubleHeader) {
         //$scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.yearloop + '/month_' + $scope.monthloop + '/day_' + $scope.dayloop + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
         //$scope.pitchingStaffGamesTotals.push($scope.game2);
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
                 $scope.WeeksTotalScore += $scope.MondaysScore + $scope.TuesdaysScore + $scope.WednesdayScore + $scope.ThursdayScore + $scope.FridayScore + $scope.SaturdayScore + $scope.SundayScore;
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
         //$scope.fourtyManRosters = "[" + $scope.fourtyManRosters + "]";
         //alert("2");
     };
     $scope.changeDate = function(value, pageLoad) {
         selectedDate.setDate(selectedDate.getDate() + value);
         $('#dateBack').attr('disabled', 'disabled');
         $('#dateForward').attr('disabled', 'disabled');

         //Goes back to previous day if between midnight and 10am
         var hourOfday = new Date().getHours();
         if ((hourOfday >= 0 && hourOfday <= 10) && pageLoad) {
             //console.log("Ran!!");
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
         }, 1000);
     };
     $scope.getWeekRange = function() {
         Date.prototype.getWeek = function(start) {
             //Calcing the starting point
             start = start || 1; //1 makes it start on Monday and not Sunday
             var today = new Date(this.setHours(0, 0, 0, 0));
             if (today.getDay() != 0) {
                 var day = today.getDay() - start;
                 var date = today.getDate() - day;
                 $scope.StartDate = new Date(today.setDate(date)).toLocaleDateString();
                 $scope.EndDate = new Date(today.setDate(date + 6)).toLocaleDateString();
             } else {
                 //finds range if it is sunday
                 var day = today.getDay();
                 var date = today.getDate() - day;
                 $scope.StartDate = new Date(today.setDate(date - 6)).toLocaleDateString();
                 $scope.EndDate = new Date(today.setDate(date)).toLocaleDateString();
             };
         }
         selectedDate.getWeek();
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
     $scope.getStaffPictureAbbreviation = function(teamAbbreviation) {
         switch (teamAbbreviation) {
             case "lan":
                 return "la";
             case "nyn":
                 return "nym";
             case "sln":
                 return "stl";
             case "sfn":
                 return "sf";
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
     $scope.setTeam = function(team) {
         $scope.selectedTeam = team;
     };
     $scope.setTeam2 = function(team) {
         if (team == 'Opp') {
             $scope.selectedTeam = $scope.opponentsTeam;
         } else {
             $scope.selectedTeam = $scope.myTeam;
         }
     };
     $scope.hittingPoints = function() {
         $scope.totalBattingPoints = 0;
         angular.forEach($scope.baseballGame, function(eachFullGameJSON) {
             //console.log(JSON.stringify(eachFullGameJSON));
             angular.forEach(eachFullGameJSON, function(eachGame) {
                 //console.log(JSON.stringify(eachGame));
                 var hittingBoxscore = eachGame.data.data.boxscore.batting;
                 angular.forEach(hittingBoxscore, function(eachTeamsBoxscore) {
                     //console.log(JSON.stringify(eachTeamsBoxscore));
                     var eachLineUp = eachTeamsBoxscore.batter;
                     //console.log(JSON.stringify(eachLineUp));
                     angular.forEach(eachLineUp, function(eachBatter) {
                         //console.log(JSON.stringify(eachBatter));
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
         //if ($scope.doubleHeader) {
         $scope.game2 = 'http://gd2.mlb.com/components/game/mlb/year_' + $scope.year + '/month_' + $scope.month + '/day_' + $scope.day + '/pitching_staff/' + $scope.myPitchingStaff + '_2.xml';
         $scope.pitchingStaffGamesTotals.push($scope.game2);
         //alert("Got here");
         //};

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
                 if (batter.away_code == $scope.myPitchingStaff || batter.home_code == $scope.myPitchingStaff) {
                     if (batter.double_header_sw != 'N') {
                         $scope.doubleHeader = true;
                         //alert("doubleHeader");
                     };
                     $scope.pitchingStaffGameID = batter.game_pk;
                     $scope.pitchingStaffStatus = batter.status;
                     if (batter.away_code == $scope.myPitchingStaff) {
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
             $scope.pitchingStaff();
         });

         $scope.getTotal();
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
 });
