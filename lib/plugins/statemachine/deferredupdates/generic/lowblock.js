ig.module( 
    'plugins.statemachine.deferredupdates.generic.lowblock' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lowblock = DeferredUpdate.extend({

        updateEntity : function( entity ){

            var gotoneutral = false;

            this.parent( entity );

            if( !entity._inputbuffer.state( "crouch" ) ){
                gotoneutral = true;
            }
            else{
                if( entity.faceOther( entity.foe ) ){
                    if( !entity._inputbuffer.state( "right" ) ){
                        gotoneutral = true;
                    }
                }
                else if( !entity._inputbuffer.state( "left" ) ){
                    gotoneutral = true;
                }
            }

            if( gotoneutral ){
                this.owner.goTo( "neutral" );
            }
        },

        awake : function( entity ){

            entity.vel                  = { x : 0, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            entity.currentAnim          = entity.anims.lowblock.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
        }
    });
});
        