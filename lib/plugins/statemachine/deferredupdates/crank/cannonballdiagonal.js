ig.module( 
    'plugins.statemachine.deferredupdates.crank.cannonballdiagonal' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankcannonballdiagonal = DeferredUpdate.extend({

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
            entity.vel = { x : entity.faceOther( entity.foe ) ? -800 : 800, y : -400 };
        },

        spinning : function( entity ){
            
            entity.vel = { x : entity.faceOther( entity.foe ) ? -800 : 800, y : -400 };
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

            this.ent                    = entity;
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            this.state                  = this.spinning;
            entity.currentAnim          = entity.anims.cannonballspin.rewind();
            this.delay                  = Delay.delay( this, 0.5, function(){ this.goToFalling( this.ent ); } );
            entity.gravityFactor        = 0;
        },

        goToFalling : function( entity ){

            entity.gravityFactor        = 1;
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            this.state                  = this.falling;
        }
    });
});
        