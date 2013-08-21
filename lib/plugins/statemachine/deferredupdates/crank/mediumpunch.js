ig.module( 
    'plugins.statemachine.deferredupdates.crank.mediumpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Crankmediumpunch = DeferredUpdate.extend({

        attackCreated : false,

        updateEntity : function( entity ){

            var multiplier;

            this.parent( entity );
            
            if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 30, y : 60 }, strength : 40 + multiplier } );
                
                this.attack.registerOwner( entity, { x : 45, y : -15 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){

                this.halfway = true;
                this.attack.kill();
            }

            if( entity.currentAnim.stopped ){
                
                this.owner.goTo( "neutral" );
                entity.attackChain = 0;
            }
        },

        sleep : function( entity ){

            this.attackCreated = false;
            this.halfway       = false;
            
            if( this.attack ){ this.attack.kill(); }
        },

        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.mediumpunch.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -400 : 400, y : 0 };
            entity.accel                = { x : 0, y : 0 };
        }
    });
});
        