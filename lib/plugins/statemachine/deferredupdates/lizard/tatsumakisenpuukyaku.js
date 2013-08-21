ig.module( 
    'plugins.statemachine.deferredupdates.lizard.tatsumakisenpuukyaku' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardtatsumakisenpuukyaku = DeferredUpdate.extend({

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

            Delay.cancelDelay( this.delay );
        },

        awake : function( entity ){

            this.goToJumping( entity );
            entity.toFront();
        },

        jumping : function( entity ){
            
            if( Math.abs( entity.vel.y ) < 360 ){ this.goToSpinning( entity ); }
        },

        spinning : function( entity ){

            entity.vel.x = entity.faceOther( entity.foe ) ? -300 : 300;
            entity.vel.y = 0;
        },

        falling : function( entity ){
            
            if( entity.currentAnim.stopped ){ this.owner.goTo( "neutral" ); }
        },

        goToJumping : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim.flip.x   = flip;
            this.state                  = this.jumping;
            entity.accel                = { x : 0, y : 0 };
            entity.currentAnim          = entity.anims.tetjump.rewind();
            entity.vel                  = { x : flip ? -800 : 800, y : -500 };

        },

        goToSpinning : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.gravityFactor        = 0;
            entity.currentAnim.flip.x   = flip;
            this.ent                    = entity;
            this.state                  = this.spinning;
            entity.currentAnim          = entity.anims.tetspin.rewind();
            this.delay                  = Delay.delay( this, 1, function(){ this.goToFalling( this.ent ); } );
        },

        goToFalling : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.gravityFactor        = 1;
            entity.currentAnim.flip.x   = flip;
            this.state                  = this.falling;
            entity.currentAnim          = entity.anims.tetjump.rewind();
            entity.vel                  = { x : entity.faceOther( entity.foe ) ? -500 : 500, y : 0 };
        }
    });
});
        