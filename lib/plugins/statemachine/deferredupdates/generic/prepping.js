ig.module( 
    'plugins.statemachine.deferredupdates.generic.prepping' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Prepping = DeferredUpdate.extend({

        updateEntity : function( entity ){

            entity.currentAnim.flip.x = entity.faceOther( entity.foe );

            this.parent( entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
        },

        awake : function( entity ){

            entity.currentAnim = entity.anims.prepping;
        }
    });
});
        