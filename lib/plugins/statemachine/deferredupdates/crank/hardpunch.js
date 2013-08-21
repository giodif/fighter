ig.module( 
    'plugins.statemachine.deferredupdates.crank.hardpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankhardpunch = DeferredUpdate.extend({

        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 80, y : 25 }, strength : 50 } );
                
                this.attack.registerOwner( entity, { x : 20, y : 10 } );
            }
            else if( entity.currentAnim.frame >= 5 && !this.halfway ){

                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){

            this.attackCreated  = false;
            this.halfway        = false;
            this.attack.kill();
        },
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.hardpunch.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };

            entity.toBack();
        }
    });
});
        