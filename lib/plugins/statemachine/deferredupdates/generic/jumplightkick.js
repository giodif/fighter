ig.module( 
    'plugins.statemachine.deferredupdates.generic.jumplightkick' 
)
.requires(
    'plugins.statemachine.deferredupdate',
    'plugins.attacks.simpleattack'
)
.defines( function(){

    Jumplightkick = DeferredUpdate.extend({

        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped || entity.standing ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 40, y : 30 }, strength : 30 } );
                this.attack.registerOwner( entity, { x : 50, y : entity.size.y - this.attack.size.y } );
            }
            else if( entity.currentAnim.frame >= 4 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){ 

            this.halfway       = false;
            this.attackCreated = false;

            if( this.attack ){ this.attack.kill(); }

            entity.lowhittarget.isVulnerable();
        },
        
        awake : function( entity ){

            entity.currentAnim          = entity.anims.jumplightkick.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            
            entity.lowhittarget.isInvincible();
            entity.toFront();
        }
    });
});
        