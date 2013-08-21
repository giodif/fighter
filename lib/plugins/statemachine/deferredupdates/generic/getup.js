ig.module( 
    'plugins.statemachine.deferredupdates.generic.getup' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Getup = DeferredUpdate.extend({

        updateEntity : function( entity ){

            var flip = entity.currentAnim.flip.x = entity.faceOther( entity.foe );

            this.parent( entity );
            entity.vel.x = flip ? 200 : -200;

            if( entity.currentAnim.stopped ){ this.owner.goTo( "neutral" ); }
        },
        awake : function( entity ){

            entity.currentAnim = entity.anims.getup.rewind();
            entity.vel.y       = -200;
        }
    });
});
        