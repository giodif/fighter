ig.module( 
    'plugins.statemachine.deferredupdates.lizard.knockdown' 
)
.requires(
    'plugins.statemachine.deferredupdates.lizard.defeated'
)
.defines( function(){

    Lizardknockdown = Lizarddefeated.extend({

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
            entity.vel                  = { x : flip ? 250 : -250, y : -200 };
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
            entity.currentAnim          = entity.anims.knockdowncrash.rewind();
            entity.currentAnim.flip.x   = !entity.faceOther( entity.foe );
        },
        rising : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? 250 : -250;

            if( entity.vel.y >= 0 ){
                this.onFalling( entity );
            }
        },
        falling : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? 250 : -250;

            if( entity.standing && entity.vel.y === 0 ){
                this.onCrashing( entity );
            }
        },
        crashed : function( entity ){

            if( entity.currentAnim.stopped ){

                entity.isVulnerable();
                this.owner.goTo( 'getup' );
            }
        },
        awake : function( entity ){
            
            this.onRising( entity );
            entity.isInvincible();
            entity.toBack();
        }
    });
});
        