ig.module( 
    'plugins.statemachine.deferredupdates.generic.lowlightpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lowlightpunch = DeferredUpdate.extend({
        
        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 80, y : 25 }, strength : 30 } );
                this.attack.registerOwner( entity, { x : 40, y : entity.size.y * 0.7 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }

            if( entity._attack === "weakcharge" ){
                this.owner.goTo( "weakcharge" );
            }
            else if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
        },
        sleep : function( entity ){ 

            this.halfway       = false;
            this.attackCreated = false;

            if( this.attack ){ this.attack.kill(); }
            
            entity.hittarget.isVulnerable();
        },
        awake : function( entity ){

            entity.currentAnim        = entity.anims.lowlightpunch.rewind();
            entity.currentAnim.flip.x = entity.faceOther( entity.foe );

            entity.hittarget.isInvincible();
            entity.toBack();
        }
    });
});
        