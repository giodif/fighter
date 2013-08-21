ig.module( 
    'plugins.statemachine.deferredupdates.generic.neutral' 
)
.requires(
    'plugins.statemachine.deferredupdate'
)
.defines( function(){

    Neutral = DeferredUpdate.extend({

        delay : undefined,

        updateEntity : function( entity ){
            var accel = entity.gaccel,
                flip  = entity.faceOther( entity.foe ),
                i;

            entity.currentAnim.flip.x = flip;
            //horizontal movement
            if( entity._inputbuffer.state( 'left' ) ){
                entity.accel.x = -accel;
            }
            else if( entity._inputbuffer.state( 'right' ) ){
                entity.accel.x = accel;
            }
            else if( !entity.standing ){
                entity.vel.x   *= 0.9;
                entity.accel.x *= 0.9;

                if( Math.abs( entity.vel.x ) < 5 ){
                    entity.vel.x = 0;
                }
                if( Math.abs( entity.accel.x ) < 5 ){
                    entity.accel.x = 0;
                }
            }
            else{
                entity.accel.x = 0;
                entity.vel.x = 0;
            }

            //only jump if not crouching
            if( entity.standing ){
                //crouching
                if( entity._inputbuffer.state( 'crouch' ) ){
                    entity.accel.x  = entity.vel.x = 0;
                    entity.accel.y  = entity.vel.y = 0;
                }
                //jumping
                else if( entity._inputbuffer.pressed( 'jump' ) ){
                    entity.standing = false;
                    entity.vel.y    = entity.jump/1.5;
                }
                //block if necessary
                else if( entity.foe.attacking ){
                    if( flip && entity._inputbuffer.state( "right" ) || !flip && entity._inputbuffer.state( "left" ) ){
                        this.owner.goTo( 'highblock' );
                        return;
                    }
                }
            }

            //standing animations
            if( entity.vel.x !== 0 && ( entity._inputbuffer.state( 'right' ) || entity._inputbuffer.state( 'left' ) ) ){
                entity.currentAnim = entity.anims.walk;
            }
            else{
                entity.currentAnim = entity.anims.idle;
            }
            //jumping and crouching animations
            if( !entity.standing ){

                if( Math.abs( entity.vel.y ) < 100 ){
                    entity.currentAnim = entity.anims.float;
                }
                else if( entity.vel.y < 0 ){
                    entity.currentAnim = entity.anims.jump;
                }
                else if( entity.vel.y > 0 ){
                    entity.currentAnim = entity.anims.fall;
                }
            }
            else if( entity._inputbuffer.state( 'crouch' ) ){

                entity.currentAnim = entity.anims.crouch;
            }

            this.parent( entity );
            this.takeAction( entity );
        },
        //if the inputbuffer has notified the player of a sucessfully completed keysequence,
        //this function will call the that function on the statemachine
        takeAction : function( entity ){

            var attack  = entity._attack,
                flip,
                flipped,
                state;

            if( attack ){

                flip    = entity.faceOther( entity.foe );
                flipped = !attack.match( /right/i );
                state   = attack.replace( flipped ? new RegExp( "left" ) : new RegExp( "right" ), '' );

                if( entity.standing && flip === flipped && this.owner.has( state ) ){ this.owner.goTo( state ); }

                entity._attack = undefined;
            }
            else{
                //state switching for basic attacks not handled by the input buffer
                //TODO: Break this out into a 'jumping', 'crouching', 'standing' states
                if( !entity.standing ){

                    if( entity._inputbuffer.pressed( 'lightkick' ) ){
                        this.owner.goTo( 'jumplightkick' );
                        return;
                    }
                    if( entity._inputbuffer.pressed( 'hardkick' ) ){
                        this.owner.goTo( 'jumphardkick' );
                        return;
                    }
                    if( entity._inputbuffer.pressed( 'lightpunch' ) ){
                        this.owner.goTo( 'jumplightpunch' );
                        return;
                    }
                    if( entity._inputbuffer.pressed( 'hardpunch' ) ){
                        this.owner.goTo( 'jumphardpunch' );
                        return;
                    }
                }
                else{
                    if( entity._inputbuffer.state( 'crouch' ) ){

                        if( entity.foe.attacking && ( flip && entity._inputbuffer.state( "right" ) || !flip && entity._inputbuffer.state( "left" ) ) ){
                            this.owner.goTo( 'lowblock' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'lightkick' ) ){
                            this.owner.goTo( 'lowlightkick' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'hardkick' ) ){
                            this.owner.goTo( 'lowhardkick' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'lightpunch' ) ){
                            this.owner.goTo( 'lowlightpunch' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'hardpunch' ) ){
                            this.owner.goTo( 'lowhardpunch' );
                            return;
                        }
                    }
                    else{
                    
                        if( entity._inputbuffer.pressed( 'lightpunch' ) ){
                            this.owner.goTo( 'lightpunch' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'hardpunch' ) ){
                            this.owner.goTo( 'hardpunch' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'lightkick' ) ){
                            this.owner.goTo( 'lightkick' );
                            return;
                        }
                        if( entity._inputbuffer.pressed( 'hardkick' ) ){
                            this.owner.goTo( 'hardkick' );
                            return;
                        }
                    }
                }
            }
        },
        sleep : function( entity ){

            this.delay = undefined;
        },
        awake : function( entity ){
         
            //reset attack stuff
            entity.attackChain   = 0;
            entity._attack       = undefined;

            //decide on the default animation
            if( entity.standing ){
                entity.anims.idle.rewind();
                if( entity._inputbuffer.state( 'crouch' ) ){
                    entity.currentAnim = entity.anims.crouch;
                }
            }
            else{ entity.anims.float.rewind(); }

            //reset the stacking order
            entity.toMiddle();
        }
    });
});
        