ig.module( 
    'plugins.statemachine.deferredupdates.generic.jumplightpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Jumplightpunch = DeferredUpdate.extend({

        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped || entity.standing ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 25, y : 35 }, strength : 30 } );
                this.attack.registerOwner( entity, { x : 40, y : 65 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){ 

            this.halfway       = false;
            this.attackCreated = false;
            
            entity.lowhittarget.isVulnerable();

            if( this.attack ){ this.attack.kill(); }
        },
        
        awake : function( entity ){

            entity.currentAnim          = entity.anims.jumplightpunch.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );

            entity.lowhittarget.isInvincible();
            entity.toFront();
        }
    });
});
        