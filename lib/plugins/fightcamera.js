/*global ig */

/*
This camera focuses on the centerpoint between the two fighers.
It limits fighter movement so that they can never be off screen.


*/

ig.module(
    'plugins.fightcamera'
)
.requires(
    'impact.entity'
)
.defines( function(){

    FightCamera = ig.Class.extend({

        size            : { x : 20, y : 15 },
        yoffset         : 60,
        limitViewport   : true,
        bounds          : undefined,

        init: function( dx, dy ) {

            this.size.x = dx || this.size.x;
            this.size.y = dy || this.size.y ;
            this.bounds = ig.game.spawnEntity( Bounds, 0, 0, { size : this.size } );
        },

        update : function( target1, target2, frame ){

            var f   = frame,    //the canvas viewport
                c   = this.getBoundsCenter( this.getTargetCenter( target1 ), this.getTargetCenter( target2 ) ),
                rL  = ( f._bgMap.width * f._bgMap.tilesize ) - ig.system.width, //right limit, left = 0
                bL  = ( f._bgMap.height * f._bgMap.tilesize ) - ig.system.height; //bottom limit, top = 0
            
            c.y -= this.yoffset; // moving the camera up just a bit;
            this.bounds.positionSelf( c );
            //get the screen position
            f.screen.x = c.x - ig.system.width / 2;
            f.screen.y = c.y - ig.system.height / 2;

            if( this.limitViewport ){
                //limit screen movement so that it doesn't show black around the edges
                if( f.screen.x < 0 ){
                    f.screen.x = 0;
                }
                else if( f.screen.x > rL ){
                    f.screen.x = rL;
                }
                if( f.screen.y < 0 ){
                    f.screen.y = 0;
                }
                else if( f.screen.y > bL ){
                    f.screen.y = bL;
                }
            }
        },
        //t1 and t2 are vectors, returns a vector
        getBoundsCenter : function( t1, t2 ){
            return { x : ( t1.x + t2.x ) / 2 , y : ( t1.y + t2.y ) / 2  };
        },
        //target is an entity, returns a vector
        getTargetCenter : function( target ){
            return { x : target.pos.x + ( target.size.x / 2 ), y : target.pos.y + ( target.size.y / 2 ) };
        }
    });

    Bounds = ig.Entity.extend({
        
        gravityFactor   : 0,
        leftLimit       : undefined, //limit fighter movement
        rightLimit      : undefined, //limit fighter movement
        boundsSize      : { x : 10, y : 1000 },

        init : function( x, y, settings ){

            var limitSettings = {};
            this.parent( x, y, settings );
            limitSettings.size  = this.boundsSize;
            this.leftLimit      = ig.game.spawnEntity( BoundsLimit, this.pos.x - this.boundsSize.x, this.pos.y, limitSettings );
            this.rightLimit     = ig.game.spawnEntity( BoundsLimit, this.pos.x + this.size.x, this.pos.y, limitSettings );
        },
        positionSelf : function( center ){

            this.pos            = { x : center.x - ( this.size.x / 2 ), y : center.y - ( this.size.y / 2 ) };
            this.leftLimit.pos  = { x : this.pos.x - this.boundsSize.x, y : this.pos.y - ( ( this.boundsSize.y - this.size.y ) / 2 ) };
            this.rightLimit.pos = { x : this.pos.x + this.size.x,       y : this.pos.y - ( ( this.boundsSize.y - this.size.y ) / 2 ) };
        },
        kill : function(){

            this.leftLimit.kill();
            this.rightLimit.kill();
            this.parent();
        }
    });

    BoundsLimit = ig.Entity.extend({
        
        gravityFactor : 0,
        collides      : ig.Entity.COLLIDES.FIXED
    });
});




