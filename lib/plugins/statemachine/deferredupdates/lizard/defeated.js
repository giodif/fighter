ig.module( 
    'plugins.statemachine.deferredupdates.lizard.defeated' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizarddefeated = DeferredUpdate.extend({

        state : undefined,

        updateEntity : function( entity ){

            this.state( entity );
            this.parent( entity );
        },
        onRising : function( entity ){

            var flip = entity.faceOther( entity.foe );

            this.state                  = this.rising;
            entity.currentAnim          = entity.anims.defeatedrise.rewind();
            entity.currentAnim.flip.x   = !flip;
            entity.vel                  = { x : flip ? 300 : -300, y : -400 };
            entity.accel                = { x : 0, y : 0 };
            entity.standing             = false;
        },
        onFalling : function( entity ){

            this.state                  = this.falling;
            entity.currentAnim          = entity.anims.defeatedfall.rewind();
            entity.currentAnim.flip.x   = !entity.faceOther( entity.foe );
        },
        onCrashing : function( entity ){

            this.state                  = this.crashed;
            entity.accel                = { x : 0, y : 0 };
            entity.currentAnim          = entity.anims.defeatedcrash.rewind();
            entity.currentAnim.flip.x   = !entity.faceOther( entity.foe );
        },
        rising : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? 300 : -300;

            if( entity.vel.y >= 0 ){
                this.onFalling( entity );
            }
        },
        falling : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? 300 : -300;

            if( entity.standing && entity.vel.y === 0 ){
                this.onCrashing( entity );
            }
        },
        crashed : function( entity ){

            if( entity.currentAnim.stopped ){
                ig.Timer.timeScale = 1;
            }
        },
        awake : function( entity ){
            
            this.onRising( entity );
            ig.Timer.timeScale = 0.5;
            entity.isInvincible();
            entity.toBack();
        }
    });
});
        