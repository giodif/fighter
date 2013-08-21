<!DOCTYPE html>

<?php
    //grab the data from the last round
    $info = json_decode( $_POST[ 'history' ], true );
    
    //grab the data that says how many fights have been recorded already
    $cs = file_get_contents( "files/counts.json" );

    $countsource = json_decode( $cs, true );

    //grab the bot's name from the last round
    $botname = $info[ "name" ];
    
    //grab the fight histroy from the last round
    $bothistory = $info[ "history" ];

    //how many rounds have been recorded for this bot? return count + 1 or zero if nothing recorded
    $count = isset( $countsource[ $botname ] ) ? $countsource[ $botname ] + 1 : 0;
    
    //create the path to the file that will hold the fight data for this round
    $historypath = "files/" . $botname . "_" . $count . ".json";
    
    //update the data that counts the number of rounds recorded
    $countsource[ $botname ] = ( string )$count;

    //save the updated index file
    file_put_contents( "files/counts.json", json_encode( $countsource ) );
    //save the round data
    file_put_contents( $historypath, json_encode( $bothistory ) );
?>