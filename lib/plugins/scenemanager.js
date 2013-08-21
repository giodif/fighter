ig.module( 
    'plugins.scenemanager' 
)
.defines( function(){

    var hasLaunched = false;

    SceneManager = ig.Class.extend({

        init : function( mode ){
        
            this.mode = mode;
        },

        launch : function( target ){

            if( !hasLaunched ){

                ig.main( 
                    target,                 //canvas selector
                    this.mode.scene,       //game object
                    this.mode.framerate,   //framerate, should be 60
                    this.mode.width,       //canvas width
                    this.mode.height,      //canvas height
                    this.mode.scale        //canvas scale mulitplier
                );
                hasLaunched = true;
            }
        },

        changeScene : function( scene ){

            this.mode.scene = scene;
            ig.system.setGame( scene );
        },

        changeMode : function( mode ){

            this.mode = mode;
            hasLaunched = false;
            this.launch();
        },

        currentScene : function(){

            return this.mode.scene;
        },

        hasLaunched : function(){

            return hasLaunched;
        }
    });
});
        