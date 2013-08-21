ig.module( 
    'plugins.statemachine.deferredupdates.lizard.cross' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardcross = DeferredUpdate.extend({

        chain : false,
        cbian2 : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                if( this.chain ){

                    this.owner.goTo( 'uppercut' );
                    entity.attackChain++;
                }
                else if( this.chain2 ){

                    this.owner.goTo( 'mediumkick' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( !this.chain && !this.chain2 ){

                this.chain = entity._inputbuffer.pressed( 'hardpunch' );
                this.chain2 = entity._inputbuffer.pressed( 'lightkick' );
            }
        },

        sleep : function( entity ){

            this.chain2 = false;
            this.chain = false;

            this.attack.kill();
        },

        awake : function( entity ){

            var flip        = entity.faceOther( entity.foe ),
                multiplier  = entity.attackChain * 5;

            entity.currentAnim          = entity.anims.cross.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -300 : 300, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 55, y : 20 }, strength : 40 + multiplier } );
            
            this.attack.registerOwner( entity, { x : 20, y : 20 } );
            entity.toFront();
        }
    });
});
        