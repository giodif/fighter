ig.module( 
    'plugins.statemachine.deferredupdates.generic.lowlightkick' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lowlightkick = DeferredUpdate.extend({
        
        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 80, y : 15 }, strength : 60 } );
                this.attack.registerOwner( entity, { x : 10, y : entity.size.y - this.attack.size.y } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){ 

            this.halfway       = false;
            this.attackCreated = false;

            if( this.attack ){ this.attack.kill(); }
            
            entity.hittarget.isVulnerable();
            entity.toMiddle();
        },
        
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.lowlightkick.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            
            entity.hittarget.isInvincible();
            entity.toFront();
        }
    });
});
        