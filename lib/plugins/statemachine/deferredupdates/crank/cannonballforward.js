ig.module( 
    'plugins.statemachine.deferredupdates.crank.cannonballforward' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankcannonballforward = DeferredUpdate.extend({

        state   : undefined,
        ent     : undefined,
        delay   : undefined,

        updateEntity : function( entity ){

            this.state( entity );
            this.parent( entity );
        },

        sleep : function( entity ){

            this.state              = undefined;
            this.ent                = undefined;
            entity._attack          = undefined;
            entity.gravityFactor    = 1;
            entity.vel              = { x : 0, y : 0 };

            Delay.cancelDelay( this.delay );
        },

        awake : function( entity ){

            this.goToJumping( entity );
        },

        jumping : function( entity ){
            
            if( entity.currentAnim.stopped ){
                this.goToSpinning( entity );
            }
            entity.vel.x = entity.faceOther( entity.foe ) ? -800 : 800;
            entity.vel.y = 0;
        },

        spinning : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? -800 : 800;
            entity.vel.y = 0;
        },

        falling : function( entity ){

            this.owner.goTo( "neutral" );
        },

        goToJumping : function( entity ){

            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            this.state                  = this.jumping;
            entity.accel                = { x : 0, y : 0 };
            entity.currentAnim          = entity.anims.cannonballjump.rewind();
        },

        goToSpinning : function( entity ){

            entity.gravityFactor        = 0;
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            this.ent                    = entity;
            this.state                  = this.spinning;
            entity.currentAnim          = entity.anims.cannonballspin.rewind();
            this.delay                  = Delay.delay( this, 1.2, function(){ this.goToFalling( this.ent ); } );
        },

        goToFalling : function( entity ){

            var dx = entity.currentAnim.flip.x = entity.faceOther( entity.foe );

            entity.gravityFactor    = 1;
            this.state              = this.falling;
            entity.vel              = { x : dx ? -600 : 600, y : 0 };
        }
    });
});
        