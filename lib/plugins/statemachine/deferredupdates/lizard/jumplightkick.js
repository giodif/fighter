ig.module( 
    'plugins.statemachine.deferredupdates.lizard.jumplightkick' 
)
.requires(
    'plugins.statemachine.deferredupdates.generic.jumphardkick' 
)
.defines( function(){

    Lizardjumplightkick = Jumphardkick.extend({

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped || entity.standing ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 40, y : 15 }, strength : 30 } );
                this.attack.registerOwner( entity, { x : 50, y : 90 } );
            }
            else if( entity.currentAnim.frame >= 4 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        awake : function( entity ){

            entity.currentAnim          = entity.anims.jumplightkick.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            
            entity.lowhittarget.isInvincible();
            entity.toFront();
        }
    });
});
        