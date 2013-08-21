ig.module( 
    'plugins.statemachine.deferredupdates.lizard.shoryuken' 
)
.requires(
    'plugins.statemachine.deferredupdate',
    'plugins.attacks.simpleattack'
)
.defines( function(){

    Lizardshoryuken = DeferredUpdate.extend({

        updateEntity : function( entity ){
            
            this.parent( entity );

            if( entity.currentAnim.stopped ){
                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 4 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
            }
        },
        sleep : function( entity ){ 

            entity._attack  = undefined;
            this.halfway    = false;

            if( this.attack ){ this.attack.kill(); }
        },
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.shoryuken.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -800 : 800, y : -500 };
            entity.accel                = { x : 0, y : 0 };

            this.attack = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 20, y : 80 }, strength : 60 } );
            this.attack.registerOwner( entity, { x : 15, y : -10 } );
            entity.toFront();
        }
    });
});
        