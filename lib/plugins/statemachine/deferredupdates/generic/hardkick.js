ig.module( 
    'plugins.statemachine.deferredupdates.generic.hardkick' 
)
.requires(
    'plugins.statemachine.deferredupdate',
    'plugins.attacks.simpleattack'
)
.defines( function(){

    Hardkick = DeferredUpdate.extend({
        
        attackCreated : false,

        updateEntity : function( entity ){

            var multiplier;

            this.parent( entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 75, y : 30 }, strength : 50 + multiplier } );
                this.attack.registerOwner( entity, { x : 20, y : 10 } );
            }
            else if( entity.currentAnim.frame >= 5 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){ 

            this.halfway       = false;
            this.attackCreated = false;

            if( this.attack ){ this.attack.kill(); }
            
            entity.toMiddle();
        },
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim        = entity.anims.hardkick.rewind();
            entity.currentAnim.flip.x = flip;
            entity.vel                = { x : flip ? -200 : 200, y : 0 };
            entity.accel              = { x : 0, y : 0 };
            
            entity.toFront();
        }
    });
});
        