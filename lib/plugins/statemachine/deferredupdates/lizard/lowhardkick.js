ig.module( 
    'plugins.statemachine.deferredupdates.lizard.lowhardkick' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.lowhardkick'
)
.defines( function(){

    Lizardlowhardkick = Lowhardkick.extend({

        updateEntity : function( entity ){

            DeferredUpdate.prototype.updateEntity.call( this, entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
            
            if( entity.currentAnim.frame >= 3 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 80, y : 15 }, strength : 60 } );
                this.attack.registerOwner( entity, { x : 10, y : entity.size.y - ( this.attack.size.y * 2 ) } );
            }
            else if( entity.currentAnim.frame >= 5 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        }
    });
});
        