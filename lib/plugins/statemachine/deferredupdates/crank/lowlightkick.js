ig.module( 
    'plugins.statemachine.deferredupdates.crank.lowlightkick' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.lowlightkick' 
)
.defines( function(){

    Cranklowlightkick = Lowlightkick.extend({

        updateEntity : function( entity ){

            DeferredUpdate.prototype.updateEntity.call( this, entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 70, y : 15 }, strength : 60 } );
                this.attack.registerOwner( entity, { x : 10, y : entity.size.y - this.attack.size.y } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        }
    });
});
        