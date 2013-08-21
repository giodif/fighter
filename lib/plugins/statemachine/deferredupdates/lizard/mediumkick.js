ig.module( 
    'plugins.statemachine.deferredupdates.lizard.mediumkick' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardmediumkick = DeferredUpdate.extend({

        chain : false,
        attackCreated : false,

        updateEntity : function( entity ){

            var multiplier;

            this.parent( entity );

            if( entity.currentAnim.stopped ){

                if( this.chain && entity.attackChain > 0 ){

                    this.owner.goTo( 'hardkick' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( entity.currentAnim.frame >= 4 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 75, y : 30 }, strength : 40 + multiplier } );
                this.attack.registerOwner( entity, { x : 20, y : 10 } );
            }
            else if( entity.currentAnim.frame >= 5 && !this.halfway ){
                
                this.halfway = true;
                this.attack.kill();
                entity.toFront();
            }
            else if( !this.chain ){
                
                this.chain = entity._inputbuffer.pressed( 'hardkick' );
            }
        },

        sleep : function( entity ){

            this.chain         = false;
            this.halfway       = false;
            this.attackCreated = false;

            if( this.attack ){ this.attack.kill(); }
        },

        awake : function( entity ){

            var flip = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.mediumkick.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -400 : 400, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            
            entity.toBack();
        }
    });
});
        