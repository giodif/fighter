ig.module( 
    'plugins.statemachine.deferredupdates.lizard.lightkick' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardlightkick = DeferredUpdate.extend({

        chain3 : false,
        chain2 : false,
        attackCreated : false,

        updateEntity : function( entity ){

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                if( this.chain3 ){

                    this.owner.goTo( 'mediumkick' );
                    entity.attackChain++;
                }
                else if( this.chain2 ){

                    this.owner.goTo( 'hardkick' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( entity.currentAnim.frame >= 2 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 40, y : 25 }, strength : 40 } );
            
                this.attack.registerOwner( entity, { x : 10, y : 10 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
                entity.toFront();
            }
            else if( !this.chain3 && !this.chain2 ){

                this.chain3 = entity._inputbuffer.pressed( 'lightkick' );
                this.chain2 = entity._inputbuffer.pressed( 'hardkick' );
            }
        },

        sleep : function( entity ){

            this.chain3        = false;
            this.chain2        = false;
            this.attackCreated = false;

            this.attack.kill();
        },

        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.lightkick.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            entity.toFront();
        }
    });
});
        