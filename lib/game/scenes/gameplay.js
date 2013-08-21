ig.module( 
    'game.scenes.gameplay' 
)
.requires(
    'impact.game',
    'game.levels.test',
    'game.levels.cranktest',
    'game.levels.bottest',
    'plugins.fightcamera',
    'plugins.mapminifier'
)
.defines(function(){

    GamePlay = ig.Game.extend({

        gravity         : 1000,
        round           : 1,

        roundOver       : false,
        gameOver        : false,

        roundWinner     : undefined,
        roundLoser      : undefined,
        gameWinner      : undefined,
        gameLoser       : undefined,

        controlOverlay  : undefined,
        paused          : false,
        
        init : function(){

            ig.MapMinifier.enableForGame();
            //this.loadLevel( LevelTest );
            //this.loadLevel( LevelCranktest );
            this.loadLevel( LevelBottest );

            this._bgMap      = this.getMapByName( "bg1" );
            this._player     = this.getEntityByName( "player" );
            this._enemy      = this.getEntityByName( "enemy" );
            this._player.foe = this._enemy;
            this._enemy.foe  = this._player;
            this._camera     = new FightCamera( ig.system.width, ig.system.height );

            this._enemy._inputbuffer.loadSeedHistory();

            //for pauseing gameplay 
            ig.input.bind( ig.KEY.P, 'pause' );
        },

        update : function(){
            
            if( ig.input.pressed( "pause" ) ){

                this.togglePause();
            }

            if( !this.paused ){

                this._camera.update( this._player, this._enemy, this );
                this.parent();
            
                if( this._player.health <= 0 || this._enemy.health <= 0 ){
                    this.roundOver = true;
                }
            }
        },

        togglePause : function(){ this.paused = !this.paused; },

        addNextRoundOverlay : function(){ },

        addPauseOverlay : function(){ }
    });
});