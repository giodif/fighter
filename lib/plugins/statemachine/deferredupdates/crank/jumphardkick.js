ig.module( 
    'plugins.statemachine.deferredupdates.crank.jumphardkick' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.jumphardkick'
)
.defines( function(){

    Crankjumphardkick = Jumphardkick.extend({

        updateEntity : function( entity ){

            DeferredUpdate.prototype.updateEntity.call( this, entity );

            if( entity.currentAnim.stopped || entity.standing ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 75, y : 25 }, strength : 50 } );
                this.attack.registerOwner( entity, { x : 10, y : 80 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        }
    });
});
        