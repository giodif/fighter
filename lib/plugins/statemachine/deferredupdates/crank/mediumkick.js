ig.module( 
    'plugins.statemachine.deferredupdates.crank.mediumkick' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankmediumkick = DeferredUpdate.extend({

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
        },
        sleep : function( entity ){

            this.halfway = false;
            this.attack.kill();
        },

        awake : function( entity ){

            var flip        = entity.faceOther( entity.foe ),
                multiplier  = entity.attackChain * 5;

            entity.currentAnim          = entity.anims.mediumkick.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -600 : 600, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 20, y : 40 }, strength : 40 + multiplier } );
            
            this.attack.registerOwner( entity, { x : 20, y : 0 } );
            entity.toFront();
        }
    });
});
        