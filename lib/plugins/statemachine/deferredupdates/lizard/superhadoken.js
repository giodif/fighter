ig.module( 
    'plugins.statemachine.deferredupdates.lizard.superhadoken' 
)
.requires(
    'plugins.statemachine.deferredupdate',
    'plugins.effects.superhadoken',
    'plugins.attacks.superhadoken'
)
.defines( function(){

    Lizardsuperhadoken = DeferredUpdate.extend({

        halfway : false,

        updateEntity : function( entity ){

            var hadokenX;

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                this.owner.goTo( "neutral" );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){

                entity.vel      = { x : entity.faceOther( entity.foe ) ? 600 : -600, y : 0 };
                hadokenX        = entity.pos.x;
                this.halfway    = true;

                if( !entity.faceOther( entity.foe ) ){   
                    hadokenX += entity.size.x;
                }
                ig.game.spawnEntity( Attacksuperhadoken, hadokenX, entity.pos.y + 60 ).getDirection( entity );
            }
        },

        sleep : function( entity ){

            this.halfway = false;
            entity._attack = undefined;
        },

        awake : function( entity ){

            entity.currentAnim          = entity.anims.hadoken.rewind();
            entity.currentAnim.flip.x   = entity.faceOther( entity.foe );
            entity.vel                  = { x : 0, y : 0 };
            entity.accel                = { x : 0, y : 0 };

            ig.game.spawnEntity( Effectsuperhadoken, entity.pos.x, entity.pos.y ).registerOwner( entity );

            entity.toBack();
        }
    });
});
        