ig.module( 
    'plugins.statemachine.deferredupdates.crank.lightkick' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Cranklightkick = DeferredUpdate.extend({

        chain2 : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                if( this.chain2 ){

                    this.owner.goTo( 'mediumkick' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( !this.chain2 ){
                
                this.chain2 = entity._inputbuffer.pressed( 'lightkick' );
            }
        },

        sleep : function( entity ){

            this.chain2 = false;
            this.attack.kill();
        },
        
        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.lightkick.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 50, y : 30 }, strength : 30 } );
            
            this.attack.registerOwner( entity, { x : 20, y : 40 } );
            entity.toBack();
        }
    });
});
        