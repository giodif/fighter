ig.module( 
    'plugins.statemachine.deferredupdates.generic.victorious' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Victorious = DeferredUpdate.extend({

        awake : function( entity ){

            entity.currentAnim          = entity.anims.victorious.rewind();
            entity.currentAnim.flip.x   = false;
            entity.vel                  = { x : 0, y : 0 };
            entity.accel                = { x : 0, y : 0 };
        }
    });
});
        