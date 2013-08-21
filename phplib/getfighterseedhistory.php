<?php
    $botname     = $_POST[ 'name' ];
    $countsource = json_decode( file_get_contents( "files/counts.json" ), true );

    if( isset( $countsource[ $botname ] ) ){

        $count   = $countsource[ $botname ];
        $history = file_get_contents( "files/" . $botname . "_" . $count . ".json" ); //this is a json string. Don't encode it
        $output  = isset( $history ) ? $history : 0;

        echo $output;
    }
?>