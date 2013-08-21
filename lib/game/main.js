ig.module( 
    'game.main' 
)
.requires(
    'impact.debug.debug',
    'impact.input',
    'plugins.scenemanager',
    'plugins.mapminifier',
    'plugins.nativeextensions',
    'plugins.statemachine.statemachine',
    'plugins.settingsmap',
    'injections.entityfaceother',
    'injections.animationstopped'
)
.defines( function(){

    var his,
        settings     = new SettingsMap(),
        scenemanager = new SceneManager( settings.get() ); //.get() uses the 'default' if not passed an identifier

    scenemanager.launch( '#canvas' );
});





























        
// $( ".postdata" ).click( function( e ){

//     $.ajax({
//         type        : "POST",
//         url         : "phplib/storefighterhistory.php",
//         data        :  { json : JSON.stringify( history ) },
//         dataType    : "json",
//         success     : function( a ){ console.log( 'a: ', a ); },
//         error       : function( e ){ console.log( "e: ", e ); }
//     });

//     return false;
// });