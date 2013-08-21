ig.module( 
    'plugins.statemachine.deferredupdates.lizard.uppercut' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizarduppercut = DeferredUpdate.extend({

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){ this.owner.goTo( "neutral" ); }
        },

        sleep : function( entity ){

            this.attack.kill();
        },

        awake : function( entity ){

            var flip        = entity.faceOther( entity.foe ),
                multiplier  = entity.attackChain * 5;

            entity.currentAnim          = entity.anims.uppercut.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -650 : 650, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 20, y : 30 }, strength : 40 + multiplier } );
            
            this.attack.registerOwner( entity, { x : 20, y : 45 } );
            entity.toFront();
        }
    });
});
        