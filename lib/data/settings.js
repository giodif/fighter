ig.module( 
    'data.settings' 
)
.requires(
    'game.scenes.gameplay'
)
.defines( function(){

    Settings = {

        "default" : {
            "scene"     : GamePlay,
            "framerate" : 60,
            "width"     : 680,
            "height"    : 420,
            "scale"     : 1
        },

        "double" : {
            "scene"     : GamePlay,
            "framerate" : 60,
            "width"     : 480,
            "height"    : 360,
            "scale"     : 2
        },

        "stutter" : {
            "scene"     : GamePlay,
            "framerate" : 60,
            "width"     : 600,
            "height"    : 340,
            "scale"     : 1
        }
    };
});
        