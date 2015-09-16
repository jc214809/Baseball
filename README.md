# BaseballApp
Fantasy Baseball Scoreboard

If you have nodejs installed, you can download an http server: 
1) Change directories to the directory where you want to serve files from: $ cd ~/angular_projects/1app 
2) If you are using nvm: $ nvm use 0.10 (specifies the version of nodejs to activate) 
3) Download and install the server as a command line command: npm install http-server -g 
4) Run the server: $ http-server ., which will produce the message Starting up http-server, serving . on: http://0.0.0.0:8080. That allows you to use urls in your browser like localhost:8080/index.html.

http://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local


http://losangeles.angels.mlb.com/images/players/525x330/545361.jpg


Google --http://mlb.mlb.com/lookup/json/named
//PlayerID lookUP

http://mlb.com/lookup/json/named.player_info.bam?sport_code=%27mlb%27&player_id=%27489002%27
https://github.com/wellsoliver/py-mlb/blob/master/py_mlb/fetcher.py

40 Man Roster Call
http://mlb.mlb.com/lookup/json/named.roster_40.bam?team_id=%27113%27
==============Better Roster Call==========================
http://m.mlb.com/lookup/json/named.roster_all.bam?roster_all&team_id=%27119%27

https://packagecontrol.io/installation
//JSON file
http://stackoverflow.com/questions/24919636/how-to-update-data-in-a-json-file-in-angularjs
Joel

Fantasy Baseball URL
http://www.mlb.com/fantasylookup/json/named.fb_index_schedule.bam?league_id=8623
http://www.mlb.com/fantasylookup/json/named.fb_index_standings.bam?league_id=8623
http://www.mlb.com/fantasylookup/json/named.fb_index_transactions.bam?num_results=6&league_id=8623
http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=25&team_id=55988 //period_id starts with 11
http://www.mlb.com/fantasylookup/json/named.fb_global_teams.bam?league_id=8623
http://www.mlb.com/fantasylookup/json/named.wsfb_news_injury.bam
http://www.mlb.com/fantasylookup/json/named.fb_players_list.bam?status=available&position=all_b&mode=stats&stats_type=%27last_year%27&order_by=points&fb_players_list.recPP=25&fb_players_list.recSP=1&league_id=8623
http://www.mlb.com/fantasylookup/json/named.fb_players_list.bam?status=available&position=all_b&mode=stats&stats_type=%27last_year%27&order_by=points&league_id=8623
http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_overview_daily.bam?period_id=25&team_id=55988
http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_stats.bam?period_id=25&team_id=55988&stats_type=last_7
http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_stats.bam?period_id=25&team_id=55988&stats_type=last_30
http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_schedule.bam?period_id=25&team_id=55988
Batter vs Pitcher == http://m.mlb.com/lookup/json/named.stats_batter_vs_pitcher_composed.bam?league_list_id=%27mlb%27&game_type=%27R%27&player_id=408252&pitcher_id=545333
http://mlb.mlb.com/fantasylookup/json/named.fb_team_score_by_date.bam?away_team_id=55988&home_team_id=60746&period_id=24
http://ui.bamstatic.com/bridge/images/social/twitter_logo_blue_16.png
