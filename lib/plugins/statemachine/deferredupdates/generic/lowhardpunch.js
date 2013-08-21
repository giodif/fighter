ig.module( 
    'plugins.statemachine.deferredupdates.generic.lowhardpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lowhardpunch = DeferredUpdate.extend({
        
        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 30, y : 60 }, strength : 60 } );
                this.attack.registerOwner( entity, { x : 80, y : ( entity.size.y / 3 ) - this.attack.size.y } );
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
        },
        awake : function( entity ){

            entity.currentAnim          = entity.anims.lowhardpunch.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );

            entity.hittarget.isInvincible();
            entity.toFront();
        }
    });
});
        