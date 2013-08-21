ig.module( 
    'plugins.statemachine.deferredupdates.lizard.lightpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardlightpunch = DeferredUpdate.extend({

        chain3        : false,
        chain2        : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                if( this.chain3 ){
                    
                    this.owner.goTo( 'cross' );
                    entity.attackChain++;
                }
                else if( this.chain2 ){

                    this.owner.goTo( 'uppercut' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( !this.chain3 && !this.chain2 ){
                
                this.chain3 = entity._inputbuffer.pressed( 'lightpunch' );
                this.chain2 = entity._inputbuffer.pressed( 'hardpunch' );
            }
        },

        sleep : function( entity ){

            this.chain3        = false;
            this.chain2        = false;

            this.attack.kill();
            
            entity.toMiddle();
        },

        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.lightpunch.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 55, y : 20 }, strength : 40 } );
            
            this.attack.registerOwner( entity, { x : 20, y : 20 } );
            entity.toBack();
        }
    });
});
        