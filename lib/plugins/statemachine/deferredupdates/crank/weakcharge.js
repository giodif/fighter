ig.module( 
    'plugins.statemachine.deferredupdates.crank.weakcharge' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankweakcharge = DeferredUpdate.extend({

        chargeEffect : undefined,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){
                
                if( entity._attack === "weakcharge" ){
                
                    this.owner.goTo( "strongcharge" );
                }
                else{ this.owner.goTo( "neutral" ); }
            }
        },

        awake : function( entity ){

            entity.currentAnim          = entity.anims.charge.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            entity._attack              = undefined;
        }
    });
});
        