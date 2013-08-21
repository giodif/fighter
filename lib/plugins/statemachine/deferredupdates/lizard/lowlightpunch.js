ig.module( 
    'plugins.statemachine.deferredupdates.lizard.lowlightpunch' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.lowhardpunch'
)
.defines( function(){

    Lizardlowlightpunch = Lowhardpunch.extend({

        updateEntity : function( entity ){

            DeferredUpdate.prototype.updateEntity.call( this, entity );

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 60, y : 15 }, strength : 30 } );
                this.attack.registerOwner( entity, { x : 15, y : 70 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        }
    });
});
        