ig.module( 
    'plugins.statemachine.deferredupdates.lizard.hardpunch' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Lizardhardpunch = DeferredUpdate.extend({

        chain : false,
        attackCreated : false,

        updateEntity : function( entity ){

            var multiplier;

            this.parent( entity );
            
            if( entity.currentAnim.frame >= 1 && !this.attackCreated ){

                this.attackCreated  = true;
                multiplier          = entity.attackChain * 5;
                this.attack         = ig.game.spawnEntity( SimpleAttack, 0, 0, { size : { x : 55, y : 20 }, strength : 40 + multiplier } );
                
                this.attack.registerOwner( entity, { x : 20, y : 20 } );
            }
            else if( entity.currentAnim.frame >= 3 && !this.halfway ){

                this.halfway = true;
                this.attack.kill();
            }

            if( entity.currentAnim.stopped ){

                if( this.chain ){
                    this.owner.goTo( 'lightpunch' );
                    entity.attackChain++;
                }
                else{
                    this.owner.goTo( "neutral" );
                }
            }
            else if( !this.chain ){
                this.chain = entity._inputbuffer.pressed( 'lightpunch' );
            }
        },

        sleep : function( entity ){

            this.chain         = false;
            this.attackCreated = false;
            this.halfway       = false;
            
            if( this.attack ){ this.attack.kill(); }
        },

        awake : function( entity ){

            var flip        = entity.faceOther( entity.foe );

            entity.currentAnim          = entity.anims.cross.rewind();
            entity.currentAnim.flip.x   = flip;
            entity.vel                  = { x : flip ? -200 : 200, y : 0 };
            entity.accel                = { x : 0, y : 0 };
            entity.toFront();
        }
    });
});
        