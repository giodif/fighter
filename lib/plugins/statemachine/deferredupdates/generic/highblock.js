ig.module( 
    'plugins.statemachine.deferredupdates.generic.highblock' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Highblock = DeferredUpdate.extend({

        ent : undefined,

        updateEntity : function( entity ){

            var flip            = entity.faceOther( entity.foe ),
                keepblocking    = false;

            this.parent( entity );

            if( flip && entity._inputbuffer.state( "right" ) || !flip && entity._inputbuffer.state( "left" ) ){
                keepblocking = true;
            }

            if( entity._inputbuffer.pressed( "crouch" ) ){
                this.owner.goTo( "lowblock" );
            }

            if( !keepblocking ){
                this.owner.goTo( "neutral" );
            }
        },

        awake : function( entity ){

            entity.vel                  = { x : 0, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            entity.currentAnim          = entity.anims.highblock.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
        }
    });
});
        