ig.module( 
    'plugins.statemachine.deferredupdates.crank.cannonballupward' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankcannonballupward = DeferredUpdate.extend({

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
            entity.vel.y = -200;
        },

        spinning : function( entity ){
            
            entity.vel.y = -1000;
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
            this.ent                    = entity;
            this.state                  = this.spinning;
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            entity.currentAnim          = entity.anims.cannonballspin.rewind();
            this.delay                  = Delay.delay( this, 0.3, function(){ this.goToFalling( this.ent ); } );
        },

        goToFalling : function( entity ){

            entity.gravityFactor        = 1;
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            this.state                  = this.falling;
        }
    });
});
        