ig.module( 
    'plugins.statemachine.deferredupdates.crank.strongcharge' 
)
.requires(
    'plugins.statemachine.deferredupdates.crank.weakcharge',
    'plugins.effects.strongcharge' 
)
.defines( function(){

    Crankstrongcharge = Crankweakcharge.extend({

        effect : undefined,

        updateEntity : function( entity ){

            this.parent( entity );
            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
        },

        sleep : function( entity ){

            this.effect.kill();
            this.effect = undefined;
        },

        awake : function( entity ){

            entity.currentAnim          = entity.anims.charge.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            
            this.effect     = ig.game.spawnEntity( Effectstrongcharge, 0, 0 );
            entity._attack  = undefined;
            
            this.effect.registerOwner( entity );
        }
    });
});
        