ig.module( 
    'plugins.statemachine.deferredupdates.crank.lightpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Cranklightpunch = DeferredUpdate.extend({

        chain2 : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.frame >= 3 && !this.halfway ){

                this.halfway  = true;
                this.attack.kill();
            }
            else if( !this.chain2 ){
                this.chain2 = entity._inputbuffer.pressed( 'lightpunch' );
            }

            if( entity.currentAnim.stopped ){

                if( this.chain2 ){

                    this.owner.goTo( 'mediumpunch' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                    entity.attackChain = 0;
                }
            }
        },

        sleep : function( entity ){

            this.chain2  = false;
            this.halfway = false;
            this.attack.kill();
        },

        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.lightpunch.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -300 : 300, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            this.attack                 = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 55, y : 20 }, strength : 30 } );
            
            this.attack.registerOwner( entity, { x : 20, y : 20 } );

            entity.toFront();
        }
    });
});
        