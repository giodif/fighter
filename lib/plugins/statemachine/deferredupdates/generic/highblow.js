ig.module( 
    'plugins.statemachine.deferredupdates.generic.highblow' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Highblow = DeferredUpdate.extend({

        halfway : false,

        updateEntity : function( entity ){

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.halfway ){

                this.halfway = true;
                //ig.Timer.timeScale = 1;
            }
            
            this.parent( entity );
        },
        receiveDamage : function( entity, amount, from, attack ){
            attack.kill();
        },
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );
            entity.currentAnim          = entity.anims.highblow.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? 200 : -200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            
            entity.isInvincible();
            //ig.Timer.timeScale = 0.5;
        },
        sleep : function( entity ){

            entity.isVulnerable();
            //ig.Timer.timeScale = 1;
        }
    });
});
        