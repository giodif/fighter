ig.module( 
    'game.scenes.gameplay' 
)
.requires(
    'impact.game',
    'game.levels.test',
    'game.levels.cranktest',
    'game.levels.bottest',
    'plugins.fightcamera',
    'plugins.countdowndisplay',
    'plugins.mapminifier',
    'plugins.righthealthbar',
    'plugins.lefthealthbar'
)
.defines(function(){

    GamePlay = ig.Game.extend({

        gravity          : 1000,
        round            : 1,

        roundWinner      : undefined,
        roundLoser       : undefined,
        gameWinner       : undefined,
        gameLoser        : undefined,
        countdownDisplay : undefined,
        player1Health    : undefined,
        player2Health    : undefined,

        countdownTimer   : undefined,
        currentCount     : 99,
        roundLength      : 99,

        controlOverlay   : undefined,
        paused           : false,
        
        init : function(){

            ig.MapMinifier.enableForGame();

            //this.loadLevel( LevelTest );
            //this.loadLevel( LevelCranktest );
            this.loadLevel( LevelBottest );

            this._bgMap           = this.getMapByName( "bg1" );
            this._player          = this.getEntityByName( "player" );
            this._enemy           = this.getEntityByName( "enemy" );
            this._player.foe      = this._enemy;
            this._enemy.foe       = this._player;
            this._camera          = new FightCamera( ig.system.width, ig.system.height );
            this.countdownTimer   = new ig.Timer( this.roundLength );

            this.countdownDisplay = ig.game.spawnEntity(                      
                CountdownDisplay, 0, 0,
                { count : this.currentCount }
            );

            this.player1Health = ig.game.spawnEntity(
                LeftHealthBar, 0, 0,
                { healthCount : 200 }
            );

            this.player2Health = ig.game.spawnEntity(
                RightHealthBar, 0, 0,
                { healthCount : 200 }
            );

            this._enemy._inputbuffer.loadSeedHistory();

            //for pausing gameplay 
            ig.input.bind( ig.KEY.P, 'pause' );
        },

        update : function(){

            var timeLeft;

            if( ig.input.pressed( "pause" ) ){

                if( this.paused ){
                    this.unpause();
                }
                else{
                    this.pause();
                }
            }

            if( !this.paused ){

                timeLeft = Math.ceil( this.countdownTimer.delta() * -1 );

                if( timeLeft < this.currentCount ){

                    this.currentCount = timeLeft;
                    this.updateCountdownTimer();
                }

                this._camera.update( this._player, this._enemy, this );
                this.parent();

                //End the round
                if( this._player.health <= 0 || this._enemy.health <= 0 || this.currentCount <= 0 ){
                    
                    this.roundOver();
                    this.pause();
                }
            }
        },

        pause : function(){

            this.paused = true;
            this.countdownTimer.pause();
        },
       
        unpause : function(){

            this.paused = false;
            this.countdownTimer.unpause();
        },

        updateCountdownTimer : function(){

            this.countdownDisplay.updateCount( this.currentCount );
        },

        roundOver : function(){

            console.log( "round over" );
        },

        nextRound : function(){

            console.log( "setting up the next round" );
        },

        gameOver : function(){

            console.log( "you suck and are dead!" );
        },

        addNextRoundOverlay : function(){},

        addPauseOverlay : function(){}
    });
});